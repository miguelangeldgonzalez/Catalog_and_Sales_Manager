import {s, get, post} from "./../app.js";

const DIR = "php/devices/";
let admin = false;

//Mostrar Dispositivos
function fetchDevices(){
	s(".card-img-top").src = "img/noImage.png";

	post(DIR + "device-list.php", {admin}, function(devices){
		let template = "";

		devices.forEach(device => {
			template += `
					<tr deviceId="${device.id}"> 
						<td>${device.marca}</td> 
						<td><a class="device-item" href="#disponible">${device.modelo}</a></td>
						<td>${device.precio}</td>
					</tr>`;
			});
		s('#devices').innerHTML = template;

		if(devices.length != 1){
			s(".device-item").forEach(b =>{
				b.addEventListener("click", () =>{
					cargarConsulta(b.parentNode.parentNode.getAttribute("deviceid"));
				});
			});
		}else{
			var b = s(".device-item");
			b.addEventListener("click", () =>{
				cargarConsulta(b.parentNode.parentNode.getAttribute("deviceid"));
			});
		}

	});
}

//cargar la consulta
export function cargarConsulta(id){
	post(DIR + "device-single.php", {id}, function(device){
		let inputs = s(".form-edit");

		inputs.forEach(input => {
			input.value = device[input.getAttribute("name")];
		});

		//s("#id").innerHTML = device.id;

		if(device.foto == undefined){
			s(".card-img-top").src = "img/noImage.png";
		}else{
			s(".card-img-top").src = "img/phones/" + device.id + device.foto;
		}
	});
}

//Cerrar Sesion
function closeSession(){
	get("php/close.php", r => {
		window.location = "index.html";
	});
}

s("#close").addEventListener("click", () => {
	closeSession();
});

// Carga del usuario
get("php/user.php", response => {
	if(response == ""){
		window.location = "index.html";
	}
	
	let data = response[0];
	s("#title").innerHTML = data.nombres;
	
	let add = "";
	let nav = s("#nav").innerHTML;

	
	if(data.cargo == "Administracion" || data.cargo == "Gerencia" || data.cargo == "Control"){
		admin = true;
		fetchDevices();

		let script = document.createElement("script");
		script.setAttribute("type", "module");
		script.src = 'js/devices/root.js';
		s("body").appendChild(script);
		
		add = nav + "<li class='nav-item'><a class='nav-link' href='panels/employees/employees.html'>Empleados</a></li>";

	}else{
		s("#add").innerHTML = "";
		fetchDevices();
		add = nav;
	}

	s("#nav").innerHTML = add;
}, true);

//Busqueda
document.addEventListener("DOMContentLoaded", function(){
	
	s('#search').addEventListener("keyup", () => {
		let search = s('#search');
		
		if(search.value){
			search = search.value;

			post(DIR + 'device-search.php', {search}, devices => {
					let template = '';

					devices.forEach(device =>{
						template += `<li><a deviceId="${device.id}" class="device-item" href="#">${device.modelo}</a></li>`;
					});

					if(devices == ''){
						s('#container').innerHTML = `No results for the search.`;
					}else{
						s("#container").innerHTML = template;
					}
				s('#search-result').style.display = "block";
			});
		}else{
			s('#search-result').style.display = "none";
		}
	});
});
