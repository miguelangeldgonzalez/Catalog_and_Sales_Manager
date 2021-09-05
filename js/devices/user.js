let dir = "php/home/";
let admin = false;

$("#form-edit-image").hide();

function fetchDevices(){
	$(".card-img-top").attr("src", "img/noImage.png");

	$.post(dir + "device-list.php", {admin}, function(response){
		let devices = JSON.parse(response);
		let template = "";

		devices.forEach(device => {
			template += `
					<tr> 
						<td class="device">${device.marca}</td> 
						<td><a deviceId="${device.id}" class="device-item" href="#">${device.modelo}</a></td> 
						<td>${device.precio}</td>
					</tr>`;
			});
		$('#devices').html(template);
	});
}

//Carga del usuario
$.ajax({
	url: dir + "user.php",
	type: "GET",
	asyn: false,
	success: function(response){
		if(response == ""){
			window.location = "index.html";
		}
		
		let data = JSON.parse(response)[0];
		$("#title").html(data.nombres);
		
		let add = "";
		let nav = $("#nav").html();
		
		if(data.cargo == "Administracion" || data.cargo == "Gerencia" || data.cargo == "Control"){
			$("script[src = 'js/devices/user.js']").after("<script type='text/javascript' src='js/devices/root.js'></script>");
			
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
		$.post(dir + "device-single.php", {id}, function(response){
			let device = JSON.parse(response)[0];
			let keys = Object.keys(device);
			let inputs = $(".form-edit");

			for(let i = 0; i < 6; i++){
				inputs[i].innerHTML = device[keys[i]];
			}
			$("#id").html(device.id);

			let cam = JSON.parse(device.camara);
			let pros = JSON.parse(device.procesador);

			inputs[6].innerHTML = "Frontal: " + cam.front + "MPX || Trasera: " + cam.back + "MPX";
			inputs[7].innerHTML = "Nombre: " + pros.name + " || Capacidad: " + pros.GHZ + " GHZ";

			if(device.foto == undefined){
				$(".card-img-top").attr("src", "img/noImage.png");
			}else{
				$(".card-img-top").attr("src", "img/phones/" + device.id + device.foto);
				console.log(device.foto);
			}
		});
}

$(document).on('click', '.device-item', function(){
	let id = $(this).attr('deviceId');
	cargarConsulta(id);
});

//Busqueda
$(document).ready(function(){
	$('#task-result').hide();

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
						template += `<li><a deviceId="${device.id}" class="device-item" href="#">${device.modelo}</a></li>`;
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
});

//Cerrar Sesion
$("#close").on("click", function(){
	$.get("php/close.php", function(response){
		window.location = "index.html";
	})
});
