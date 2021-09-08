//Mostrar Dispositivos
export function fetchDevices(){
	s(".card-img-top").src = "img/noImage.png";

	post(DIR + "device-list.php", {admin}, function(devices){
		let template = "";

		devices.forEach(device => {
			template += `
					<tr deviceId="${device.id}"> 
						<td>${device.marca}</td> 
						<td><a class="device-item" href="#query-image">${device.modelo}</a></td>
						<td>${device.precio}</td>
					</tr>`;
			});
		s('#devices').innerHTML = template;

		s(".device-item").forEach(b =>{
			b.addEventListener("click", () =>{
				cargarConsulta(b.parentNode.parentNode.getAttribute("deviceid"));
			});
		});
	});
}

//cargar la consulta
export function cargarConsulta(id){
	console.log(id);
	post(DIR + "device-single.php", {id}, function(device){
		let keys = Object.keys(device);
		let inputs = s(".form-edit");

		for(let i = 0; i < 6; i++){
			inputs[i].innerHTML = device[keys[i]];
		}
		s("#id").innerHTML = device.id;

		let cam = JSON.parse(device.camara);
		let pros = JSON.parse(device.procesador);

		inputs[6].innerHTML = "Frontal: " + cam.front + "MPX || Trasera: " + cam.back + "MPX";
		inputs[7].innerHTML = "Nombre: " + pros.name + " || Capacidad: " + pros.GHZ + " GHZ";

		if(device.foto == undefined){
			s(".card-img-top").src = "img/noImage.png";
		}else{
			s(".card-img-top").src = "img/phones/" + device.id + device.foto;
		}
	});
}
