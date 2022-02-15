import { s, postForm } from "./app.js";
import { getUser } from "./utilities.js";

//Comprobar si hay una sesión activa
getUser(range => {
	if(range > 0){
		window.location = "devices.html";

	}else{
		s("#form").addEventListener("submit", e => {
			e.preventDefault();
		
			postForm("php/index/logIn.php", s("#form"), function (response) {
				console.log(response);
				if (response == "1") {
					window.location = "devices.html";
				} else {
					alert("Usuario o contraseña incorrecto.");
				}
			});
		});
	}
}, false);

