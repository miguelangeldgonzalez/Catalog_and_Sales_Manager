import { s, get, post, postForm } from "./../app.js";

var html;
const DIR = "php/devices/";

//Cancelar Edicion
function cancelEdit() {
	s(".form-edit").innerHTML = "";
	s(".edit-control").innerHTML = "";
	s(".card-img-top").src = "img/noImage.png";
	s("#form-edit-image").style.display = "none";

	get(DIR + "delete-edit-image.php");
}

//Cargar control de la consulta
function showControlQuery(d) {
	let b = s("#disponible");
	
	if (d) {
		b.value = "Disponible";
		b.className = "btn my-2 btn-success";
		b.onmouseover = function(){ b.value = "Marcar como no disponible"; }
		b.onmouseout = function(){ b.value = "Disponible"; }
	} else {
		b.value = "No Disponible";
		b.className = "btn my-2 btn-warning";
		b.onmouseover = function(){ b.value = "Marcar como disponible"; }
		b.onmouseout = function(){ b.value = "No Disponible"; }
	}	

	b.style.display = "block";
}

//Elminar Dispositivo
function deleteDevice(id){
	if (confirm("Deseas eliminarlo?")) {
		post(DIR + 'device-delete.php', { id }, () => {
			s("#devices").removeChild(s(`tr[deviceid='${id}']`));
		});
	}
}

//Cargar Eventos de los botones
function loadEvents() {
	s("#disponible, .availibility").forEach(b => {
		b.addEventListener("click", () => {
			let data = {};

			if(b.className == "availibility"){
				data.id = b.parentNode.parentNode.getAttribute("deviceid");
				data.d = b.parentNode.parentNode.getAttribute("d");
			}else{
				data.id = s("#id").innerHTML;
				data.d = s(`tr[deviceid='${data.id}']`).getAttribute("d");
			}

			post(DIR + "disponibilidad.php", data, r => {
				if(data.d == "true"){
					s(`tr[deviceid='${data.id}']`).setAttribute("d", "false");
					s(`tr[deviceid='${data.id}'] .availibility`).src = "img/icons/x.png";
					data.d = false;
				}else{
					s(`tr[deviceid='${data.id}']`).setAttribute("d", "true");
					s(`tr[deviceid='${data.id}'] .availibility`).src = "img/icons/check.png";
					data.d = true;
				}

				if(b.id == "disponible"){
					showControlQuery(data.d);
				}
			});
		});
	});

	s(".delete").forEach(b => {
		b.addEventListener("click", () => {
			deleteDevice(b.parentNode.parentNode.getAttribute("deviceid"));
		})
	});
}

//Cargar controles de la lista
function showControlDevices() {
	cancelEdit();

	let button = document.createElement("input");
	button.style.display = "none";
	button.type = "button";
	button.id = "disponible";

	s(".card-body")[0].insertBefore(button, s("#send-edit"));

	s(".fetch thead tr").innerHTML += html.tableControl;

	post(DIR + "device-list.php", { admin: true }, devices => {

		devices.forEach(device => {
			for (let i = 0; i < 3; i++) {
				s(`tr[deviceid='${device.id}']`).appendChild(document.createElement('td'));
			}

			let td = s(`tr[deviceid='${device.id}'] td`);
			let elements = ["availibility", "delete", "edit"];

			for (let i = 0; i < 3; i++) {
				button = document.createElement("input");
				button.width = "16";
				button.height = "16";
				button.type = "image";
				button.className = elements[i];

				if (i == 0) {
					if (device.disponible == "1") {
						button.src = "img/icons/check.png";
						s(`tr[deviceid='${device.id}']`).setAttribute("d", true);
					} else {
						button.src = "img/icons/x.png";
						s(`tr[deviceid='${device.id}']`).setAttribute("d", false);
					}
				} else {
					button.src = "img/icons/" + elements[i] + ".png";
				}

				td[3 + i].appendChild(button);
			}
		});

		loadEvents();
	});
}

//Añadir el control de la tabla y el panel de añadir dispositivo
get("js/devices/html.json", r => {
	html = r;
	showControlDevices();

	get("panels/add/add.html", (e) => {
		s(".col-md-7 div")[3].innerHTML = e;
	});
}, true);

//Cargar Control de la consulta
s(".device-item").forEach(b => {
	b.addEventListener("click", () => {
		let d = b.parentNode.parentNode.getAttribute("d");
		showControlQuery(d == "true" ? true : false);
	});
});

//Eliminar
$(document).on('click', '.delete', function () {
	
});

//Cargar el Formulario de Edición
$(document).on('click', '.edit', function () {
	$("#disponible").css("visibility", "hidden");
	$("#form-edit-image").show();

	$(".form-edit").html("<input class='input-group-text w-75 form-input-edit' type='text'>");

	for (i = 2; i < 5; i++) {
		$(".form-edit")[i].innerHTML = "<input class='input-group-text w-75 form-input-edit' type='number'>";
	}

	$(".form-edit")[6].innerHTML = html.formEditCamara;

	$(".form-edit")[7].innerHTML = html.formEditProcesador;

	let id = $(this).attr('deviceId');

	$.post(DIR + 'device-single.php', { id }, function (response) {
		let device = JSON.parse(response)[0];
		let keys = Object.keys(device);

		let camara = JSON.parse(device.camara);
		$("input[name='camaraFrontal']").val(camara.front);
		$("input[name='camaraTrasera']").val(camara.back);

		let procesador = JSON.parse(device.procesador);
		$("input[name='procesadorNombre']").val(procesador.name);
		$("input[name='procesadorGHZ']").val(procesador.GHZ);

		let inputs = $(".form-input-edit");


		for (let i = 0; i < 6; i++) {
			inputs[i].value = device[keys[i]];
			inputs[i].name = keys[i];
		}

		inputs[10].name = "id";
		inputs[10].value = device.id;
		inputs[10].setAttribute("readonly", true);

		if (device.foto == undefined) {
			$(".card-img-top").attr("src", "img/noImage.png");
		} else {
			$(".card-img-top").attr("src", "img/phones/" + device.id + device.foto);
		}
		let buttons = html.editControl;

		$("#send-edit").append(buttons);
	});
});

//Cargar Edición de la Imagen
$("#edit-image").on("change", function () {
	var foto = new FormData($("#form-edit-image")[0]);

	$.ajax({
		type: "POST",
		url: DIR + "device-edit-image.php",
		data: foto,
		contentType: false,
		processData: false,
		beforeSend: function () {

		},
		success: function (response) {
			switch (response) {
				case "1":
					alert("Formato de imagen no admitido");
					$("#edit-image").val("");
					break;
				case "2":
					alert("Tamaño de imagen no admitido");
					$("#edit-image").val("");
					break;
				case ".jpg":
				case ".png":
					$(".card-img-top").attr("src", "img/tmpImage" + response);
			}
		}
	})
});

//Enviar Edición
$("#send-edit").submit(function (e) {
	e.preventDefault();

	$.ajax({
		url: DIR + "device-edit.php",
		data: new FormData($("#send-edit")[0]),
		type: "POST",
		processData: false,
		contentType: false,
		success: function (response) {
			if (response == "1") {
				cancelEdit();
				fetchDevices();
				showControlDevices();
				alert("Edición completa");
			}
		}
	})
});