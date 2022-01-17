import { s, get, post, postForm } from "./../app.js";
import { cargarConsulta } from "./user.js";

var html;
var edit = false;
const DIR = "php/devices/";

//Cancelar Edicion
function cancelEdit() {
	edit = false;
	s(".card-img-top").src = "img/noImage.png";
	s("#form-edit-image").style.display = "none";
	s("#availibility").style.display = "none";
	s(".form-edit").forEach(tr => {tr.innerHTML= ""});
	s("#edit").removeChild(s(".edit-control"));

	get(DIR + "delete-edit-image.php");
}
function changeAvailibility(id, availibility){
	let data = {
		id: id,
		d: availibility ? 1 : 0
	};
	
	if(!availibility){
		s(`tr[deviceid='${data.id}']`).setAttribute("d", "false");
		s(`tr[deviceid='${data.id}'] .availibility`).src = "img/icons/x.png";
	}else{
		s(`tr[deviceid='${data.id}']`).setAttribute("d", "true");
		s(`tr[deviceid='${data.id}'] .availibility`).src = "img/icons/check.png";
	}
	
	post(DIR + "device-change-availibility.php", data, () => {});
}

//Cargar control de la consulta
function showControlQuery(availibility) {
	if(edit){
		cancelEdit();
	}
	
	let button = s("#availibility");
	
	if (!availibility) {
		button.value = "Disponible";
		button.className = "btn my-2 btn-success";
		button.onmouseover = function(){ button.value = "Marcar como no disponible"; }
		button.onmouseout = function(){ button.value = "Disponible"; }
	} else {
		button.value = "No Disponible";
		button.className = "btn my-2 btn-warning";
		button.onmouseover = function(){ button.value = "Marcar como disponible"; }
		button.onmouseout = function(){ button.value = "No Disponible"; }
	}	

	button.style.display = "block";
}

//Elminar Dispositivo
function deleteDevice(id){
	if (confirm("Deseas eliminarlo?")) {
		post(DIR + 'device-delete.php', { id }, () => {
			s("#devices").removeChild(s(`tr[deviceid='${id}']`));
			if(s("#id input").value == id || s("#id").innerHTML == id){
				cancelEdit();
			}
		});
	}
}

function editDevice(id){
	s("#availibility").style.display = "none";
	s("#form-edit-image").style.display = "block";

	s("#edit-image").addEventListener("change", () => {
		postForm(DIR + "device-edit-image.php", s("#form-edit-image"), response => {
			switch (response) {
				case "1":
					alert("Formato de imagen no admitido");
					s("#edit-image").value = "";
					break;
				case "2":
					alert("Tamaño de imagen no admitido");
					s("#edit-image").value = "";
					break;
				case ".jpg":
				case ".png":
					s(".card-img-top").setAttribute("src", "img/tmpImage" + response);
			}
		})
	})

	s(".form-edit").forEach(b => {
		b.innerHTML = "<input class='input-group-text w-75 form-input-edit' type='text'>";
	});

	for(let i = 2; i < 5; i++){
		s(".form-edit")[i].innerHTML = "<input class='input-group-text w-75 form-input-edit' type='number'>";
	}

	s(".form-edit")[6].innerHTML = html.formEditCamara;
	s(".form-edit")[7].innerHTML = html.formEditProcesador;

	post(DIR + "device-single.php", {id}, device => {
		console.log(device);
		let keys = Object.keys(device);

		let camara = JSON.parse(device.camara);
		s("#edit input[name='camaraFrontal']").value = camara.front;
		s("#edit input[name='camaraTrasera']").value = camara.back;

		let procesador = JSON.parse(device.procesador);
		s("#edit input[name='procesadorNombre']").value = procesador.name;
		s("#edit input[name='procesadorGHZ']").value = procesador.GHZ;

		let inputs = s(".form-input-edit");

		for (let i = 0; i < 6; i++) {
			inputs[i].value = device[keys[i]];
			inputs[i].name = keys[i];
		}

		inputs[10].value = device.id;
		inputs[10].setAttribute("name", "id");
		inputs[10].setAttribute("readonly", true);

		if (device.foto == undefined) {
			s(".card-img-top").setAttribute("src", "img/noImage.png");
		} else {
			s(".card-img-top").setAttribute("src", "img/phones/" + device.id + device.foto);
		}

		if(!edit){
			let editControl = document.createElement("div");
			editControl.className = "edit-control";
			editControl.innerHTML = html.editControl;
			
			s("#edit").appendChild(editControl);
	
			s("#cancelar").addEventListener("click", () => {cancelEdit()});
		}

		edit = true;

		s("#edit").addEventListener("submit", e => {
			e.preventDefault();

			postForm(DIR + "device-edit.php", s("#edit"), r =>{
				if(r == "1"){
					let newId = s(`#edit input[name='modelo']`).value + "-" + s(`#edit input[name='almacenamiento']`).value + "-" + s(`#edit input[name='precio']`).value;

					s(`tr[deviceid='${id}']`).setAttribute("deviceid", newId);
					cancelEdit();
					alert("Dispositivo Editado Correctamente");
				}
			});
		})
	});
}

function addSingle(device){
	let tr = document.createElement("tr");
	tr.setAttribute("deviceid", device.id);
	tr.setAttribute("d", true);
	s("#devices").appendChild(tr);

	s(`tr[deviceid="${device.id}"]`).innerHTML = `
		<td>${device.marca}</td> 
		<td><a class="device-item" href="#disponible">${device.modelo}</a></td>
		<td>${device.precio}</td>
		<td><input type="image" width="16px" height="16px" src="img/icons/check.png" class="availibility" /></td>
		<td><input type="image" width="16px" height="16px" src="img/icons/delete.png" class="delete" /></td>
		<td><input type="image" width="16px" height="16px" src="img/icons/edit.png" class="edit" /></td>`;

	s(`tr[deviceid="${device.id}"] .device-item`).addEventListener("click", () => {
		showControlQuery(s(`tr[deviceid="${device.id}"]`).getAttribute("d") == "true" ? false : true);
		cargarConsulta(device.id);
	});

	s(`tr[deviceid="${device.id}"] .availibility`).addEventListener("click", () => {
		changeAvailibility(device.id, s(`tr[deviceid="${device.id}"]`).getAttribute("d") == "true" ? false : true);
	});

	let elements = [
		{element : `tr[deviceid="${device.id}"] .delete`, functionElement : e => {deleteDevice(e)}},
		{element : `tr[deviceid="${device.id}"] .edit`, functionElement : e => {editDevice(e)}}
	];

	elements.forEach(element => {
		s(element.element).addEventListener("click", () => {
			element.functionElement(device.id);
		});
	});

}

function addDevice(){
	postForm(DIR + "device-add.php", s("#add"), response => {
		switch(response.code){
			case 1:
				alert("La imagen supera los 3MB");
				break;
			case 2:
				alert("La imagen tiene un formato no admitido");
				break;
			case 3:
				alert("Dispositivo Añadido Correctamente");
				addSingle(response);
				s("#add").reset();
				break;
			default:
				alert("No se pudo añadir el dispositivo");
		}
	}, true);
}



//Cargar Eventos de los botones
function loadEvents(one) {
	s("#availibility").addEventListener("click", () => {
		let id = s("#id").innerHTML;
		let d = s(`tr[deviceid='${id}']`).getAttribute("d") == "true" ? false : true;
		changeAvailibility(id, d);
		showControlQuery(d);
	});

	if(!one){
		s(".availibility").forEach(button => {
			button.addEventListener("click", () => {
				changeAvailibility(button.parentNode.parentNode.getAttribute("deviceid"), button.parentNode.parentNode.getAttribute("d") == "true" ? false : true);
			});
		});
	
		let elements = [
			{element : ".delete", functionElement : e => {deleteDevice(e)}, attr : "deviceid"},
			{element : ".edit", functionElement : e => {editDevice(e)}, attr : "deviceid"}
		];
	
		elements.forEach(element => {
			s(element.element).forEach(button => {
				button.addEventListener("click", () => {
					element.functionElement(button.parentNode.parentNode.getAttribute(element.attr));
				});
			});
		});
	
		s(".device-item").forEach(button => {
			button.addEventListener("click", () => {
				showControlQuery(button.parentNode.parentNode.getAttribute("d") == "true" ? false : true);
				cargarConsulta(button.parentNode.parentNode.getAttribute("deviceid"));
			});
		});
	}else{
		var button = s(".availibility");
		button.addEventListener("click", () => {
				changeAvailibility(button.parentNode.parentNode.getAttribute("deviceid"), button.parentNode.parentNode.getAttribute("d") == "true" ? false : true);
		});
	
		let elements = [
			{element : ".delete", functionElement : e => {deleteDevice(e)}, attr : "deviceid"},
			{element : ".edit", functionElement : e => {editDevice(e)}, attr : "deviceid"}
		];
	
		elements.forEach(element => {
			s(element.element).addEventListener("click", () => {
				element.functionElement(button.parentNode.parentNode.getAttribute(element.attr));
			});
		});
		
	
		s(".device-item").addEventListener("click", () => {
			showControlQuery(button.parentNode.parentNode.getAttribute("d") == "true" ? false : true);
			cargarConsulta(button.parentNode.parentNode.getAttribute("deviceid"));
		});
	}

	s("#add").addEventListener("submit", e => {
		e.preventDefault();
		addDevice();
	});
}

//Cargar controles de la lista
function showControlDevices() {
	edit ? cancelEdit() : false;

	post(DIR + "device-list.php", { admin: true }, devices => {
		
		devices.forEach(device => {
			for (let i = 0; i < 3; i++) {
				s(`tr[deviceid='${device.id}']`).appendChild(document.createElement('td'));
			}
			

			let td = s(`tr[deviceid='${device.id}'] td`);
				
			if (device.disponible == "1") {
				td[3].innerHTML = html.availibilityTrue;
				s(`tr[deviceid='${device.id}']`).setAttribute("d", true);
			} else {
				td[3].innerHTML = html.availibilityFalse;
				s(`tr[deviceid='${device.id}']`).setAttribute("d", false);
			}

			td[4].innerHTML = html.deleteButton;
			td[5].innerHTML = html.editButton;
	
		});

		loadEvents(devices.length == 1 ? true : false);
	});
}

//Añadir el control de la tabla y el panel de añadir dispositivo
get("js/devices/html.json", r => {
	html = r;
	s(".fetch thead tr").innerHTML += html.tableControl;

	let button = document.createElement("input");
	button.style.display = "none";
	button.id = "availibility";
	button.type = "button";

	s(".card-body")[0].insertBefore(button, s("#edit"));
	
	get("panels/add/add.html", (e) => {
		s(".col-md-7 div")[3].innerHTML = e;
		showControlDevices();
	});
}, true);
