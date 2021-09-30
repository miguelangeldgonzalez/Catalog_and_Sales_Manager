import { s, get, postForm } from "./app.js";

//Comprobar si hay una sesión activa
get("php/user.php", function (response) {
	switch (response.cargo) {
		case "Control":
		case "Asesor":
		case "Administración":
			window.location = "devices.html";
	}
}, true);

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
