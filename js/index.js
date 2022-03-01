import { s, postForm } from "./app.js";
import { getUser } from "./utilities.js";

//Comprobar si hay una sesión activa
getUser(user => {
	if(user.range > 0){
		window.location = "devices.html";
	}
}, false);

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
