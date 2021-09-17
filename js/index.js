import {s, get, postForm} from "./app.js";

//Comprobar si hay una sesión activa
get("php/index/session_active.php", function(response){
	if(response != 0){
		window.location = "devices.html";
	}	
});

s("#form").addEventListener( "submit", e => {
	e.preventDefault();

	postForm("php/index/logIn.php", s("#form"), function(response){
		if(response == "1"){
			window.location = "devices.html";
		}else{
			alert("Usuario o contraseña incorrecto.");
		}
	});
});
