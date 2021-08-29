let dir = "php/home/";
let admin = false;

$(".table-control").hide();
$("#form-edit-image").hide();

function fetchDevices(){
	$("#control").hide();
	$(".card-img-top").attr("src", "img/noImage.png");

	$.post(dir + "device-list.php", {admin}, function(response){
		let devices = JSON.parse(response);
		let template = "";
		
		if(admin){
			$(".table-control").show();
		
			devices.forEach(device => {
				template += `
						<tr> 
							<td class="device">${device.marca}</td> 
							<td><a taskId="${device.id}" class="device-item" href="#">${device.modelo}</a></td> 
							<td>${device.precio}</td>`;
				if(device.disponible == "1"){
					template += `<td><img src="img/icons/check.png" height="16px" width="16px"></td>`;
				}else{
					template += `<td><img src="img/icons/x.png" height="16px" width="16px"></td>`;
				}
				template += `<td><a href="#" class="delete" deviceId="${device.id}"><img height="16px" width="16px" src="img/icons/delete.png"></a></td>
							<td><a href="#" class="edit" deviceId="${device.id}"><img height="16px" width="16px" src="img/icons/edit.png"></a></td>
						</tr>`;
			});
		}else{
			devices.forEach(device => {
				template += `
						<tr> 
							<td class="device">${device.marca}</td> 
							<td><a taskId="${device.id}" class="device-item" href="#">${device.modelo}</a></td> 
							<td>${device.precio}</td> 
						</tr>`;
			});
		}
		
		$('#tasks').html(template);

	});
}

//Cancelar Edicion
function cancelEdit(){
	$("#id").html("");
	$(".form-edit").html("");
	$(".edit-control").html("");
	$("#form-edit-image").hide();

	$.get(dir + "delete-edit-image.php", function(){
		fetchDevices();
	});
}

function sendEdit(){
	let inputs = $(".form-input-edit");

	let data = {
		marca: undefined,
		modelo: undefined,
		precio: undefined,
		almacenamiento: undefined,
		RAM: undefined,
		SO: undefined,
		camara: undefined,
		procesador: undefined,
		id: undefined
	};

	let keys = Object.keys(data);

	for(let i = 0; i < 6; i++){
		data[keys[i]] = inputs[i].value;
	}
	
	let cam = {
		front: inputs[6].value,
		back: inputs[7].value
	};
	
	let pros = {
		name: inputs[8].value,
		GHZ: inputs[9].value
	};
	
	data.camara = JSON.stringify(cam);
	data.procesador = JSON.stringify(pros);

	data.id = $("#id").html();

	$.post(dir + "device-edit.php", data, function(response){
		if(response == "1"){
			fetchDevices();
			alert("Dispositivo Editado correctamente");
			cargarConsulta(response);
		}
	});
}

//Carga del usuario
$.ajax({
	url: dir + "user.php",
	type: "GET",
	success: function(response){
		if(response == ""){
			window.location = "index.html";
		}
		
		let data = JSON.parse(response)[0];
		$("#title").html(data.nombres);
		
		let add = "";
		let nav = $("#nav").html();
		
		if(data.cargo == "Administracion" || data.cargo == "Gerencia" || data.cargo == "Control"){
			admin = true;
			add = nav + "<li class='nav-item'><a class='nav-link' href='panels/employees/employees.html'>Empleados</a></li>";

		}else{
			$("#add").html("");
			add = nav;
		}
		$("#nav").html(add);

		fetchDevices();
	}
});

//cargar la consulta
function cargarConsulta(id){
	cancelEdit();
		$.post(dir + "device-single.php", {id}, function(response){
			const task = JSON.parse(response);

			if(admin){
				if(task[0].disponible == 1){
					$("#disponible").attr("class", "btn btn-success");
					$("#disponible").attr("value", "Disponible");
					$("#disponible").attr("d", "true");
				}else{
					$("#disponible").attr("class", "btn btn-warning");
					$("#disponible").attr("value", "No Disponible");
					$("#disponible").attr("d", "false");
				}

				$("#control").show();
			}

			$('#id').html(task[0].id);
			$('#marca').html(task[0].marca);
			$('#modelo').html(task[0].modelo);
			$('#precio').html(task[0].precio);
			$('#SO').html(task[0].SO);
			$('#RAM').html(task[0].RAM);
			$('#almacenamiento').html(task[0].almacenamiento);

			let cam = JSON.parse(task[0].camara);
			$('#camara').html("Frontal: " + cam.front + "MPX || Trasera: " + cam.back + "MPX");

			let pros = JSON.parse(task[0].procesador)
			$('#procesador').html("Nombre: " + pros.name + " || Capacidad: " + pros.GHZ + " GHZ");

			if(task[0].foto == undefined){
				$(".card-img-top").attr("src", "img/noImage.png");
			}else{
				$(".card-img-top").attr("src", "img/phones/" + task[0].id + task[0].foto);
			}
		});
}

$(document).ready(function(){
	$('#task-result').hide();

	//Busqueda
	$('#search').keyup(function(e){
		e.preventDefault();
		if($('#search').val()){
			let search = $('#search').val();
			$.ajax({
				url: dir + 'device-search.php',
				type: 'POST',
				data: {search: search},
				success: function(response){
					console.log(response);

					let tasks = JSON.parse(response);
					let template = '';

					tasks.forEach(device =>{
						template += `<li><a taskId="${device.id}" class="device-item" href="#">${device.modelo}</a></li>`;
					});

					if(tasks == ''){
						$('#container').html(`No results for the search.`);
						console.log("cumple");
					}else{
						$("#container").html(template);
					}
				$('#task-result').show();
				}
			});
		}else{
			$('#task-result').hide();
		}
	});

	//eliminar
	$(document).on('click','.delete', function(){
		if(confirm("Deseas eliminarlo?")){
			let id = $(this).attr('deviceId');
			$.post(dir + 'device-delete.php', {id}, function(response){
				console.log(response);
				fetchDevices();
			});
		}
	});

	//Editar
	$(document).on('click','.edit', function(){
		$("#form-edit-image").show();
		$("#control").hide();

		$(".form-edit").html("<input class='input-group-text w-75 form-input-edit' type='text'>");
		for(i = 2; i < 5; i++){
			$(".form-edit")[i].innerHTML = "<input class='input-group-text w-75 form-input-edit' type='number'>";
		}

		$(".form-edit")[6].innerHTML = `<div class="input-group d-inline">
                                    <input type="number" step=".01" placeholder="Frontal" class="w-75 form-control form-input-edit" name="camaraFrontal" id="camaraFrontal">
            
                                    <input type="number" step=".01" placeholder="Trasera" class="w-75 form-control form-input-edit" name="camaraTrasera" id="camaraTrasera">
                                </div>`;

		$(".form-edit")[7].innerHTML = `<div class="input-group d-inline">
                                <input type="text" class="w-75 form-control form-input-edit" placeholder="Nombre" name="procesadorNombre" id="procesadorNombre">

                                <input type="number" placeholder="Capacidad" step=".01" class="w-75 form-control form-input-edit" name="procesadorGHZ" id="procesadorGHZ">
                            </div>`;

		let id = $(this).attr('deviceId');
		
		$.post(dir + 'device-single.php', {id}, function(response){
			let device = JSON.parse(response);
			let keys = Object.keys(device[0]);

			let camara = JSON.parse(device[0].camara);
			let procesador = JSON.parse(device[0].procesador);

			$("#camaraFrontal").val(camara.front);
			$("#camaraTrasera").val(camara.back);

			$("#procesadorNombre").val(procesador.name);
			$("#procesadorGHZ").val(procesador.GHZ);
			
			let inputs = $(".form-input-edit");

			for(let i = 0; i < (inputs.length - 4); i++){
				let key = keys[i];
				inputs[i].value = device[0][key]; 
			}

			$("#id").html(device[0].id);

			if(device[0].foto == undefined){
				$(".card-img-top").attr("src", "img/noImage.png");
			}else{
				$(".card-img-top").attr("src", "img/phones/" + device[0].id + device[0].foto);
			}
			let buttons = `<input class="btn btn-danger" type="button" value="Cancelar" onclick="cancelEdit()"><input class="btn btn-success" type='button' onclick="sendEdit()" value="Enviar">`;
	
			$(".edit-control").html(buttons);
		});
		
	});

	//Editar Imagen
	$("#edit-image").on("change", function(){
		var foto = new FormData($("#form-edit-image")[0]);

		$.ajax({
			type: "POST",
			url: dir + "device-edit-image.php",
			data: foto,
			contentType: false, 
			processData: false,
			beforeSend: function(){

			},
			success: function(response){
				switch(response){
					case "1":
						alert("Formato de imagen no admitido");
						$("#edit-iamge").val("");
						break;
					case "2":
						alert("Tamaño de imagen no admitido");
						$("#edit-iamge").val("");
						break;
					case ".jpg":
					case ".png":
						$(".card-img-top").attr("src", "img/tmpImage" + response);		
				}
			}
		})
	});

	//Cargar la consulta
	$(document).on('click', '.device-item', function(){
		let id = $(this).attr('taskId');
		cargarConsulta(id);
	});
	
	//Manejo de disponibilidad
	$("#disponible").on("click", function(){
	
		let data = {
			d: 0,
			id: $("#id").html()
		}
		if($("#disponible").attr("d") == "false"){
			data.d = 1;
		}
	
		$.post(dir + "disponibilidad.php", data, function(){
			cargarConsulta(data.id);
			fetchDevices();
		})
	});
	
	$("#disponible").mouseenter(function(){
		let val = $("#disponible").attr("d");
		if(val == "true"){
			$("#disponible").attr("value", "Marcar Como No Disponible");
		}else{
			$("#disponible").attr("value", "Marcar Como Disponible");
		}
	});
	
	$("#disponible").mouseout(function(){
		let val = $("#disponible").attr("d");
		if(val == "true"){
			$("#disponible").attr("value", "Disponible");
		}else{
			$("#disponible").attr("value", "No Disponible");
		}
	});
	
	//Cerrar Sesion
	$("#close").on("click", function(){
		$.get("php/close.php", function(response){
			window.location = "index.html";
		})
	});
});

$("#formulario").submit(function(e){
	e.preventDefault();
	
	$.ajax({
		method: "POST",
		data: new FormData(this),
		url: dir + "device-add.php",
		contentType: false,
		processData: false,
		cache: false,
		beforeSend: function(){

		},
		success: function(response){
			console.log(response);

			response = parseInt(response);
			switch(response){
				case 1:
					alert("La imagen supera los 2 MB");
					break;
				case 2:
					alert("La imagen tiene un formato no admitido");
					break;
				case 3:
					alert("Dispositivo añadido correctamente");
					$("#formulario")[0].reset();
					fetchDevices();
					break;
				default:
					alert("Archivo de imagen no admitido");
				}
			}
	});
});

