$(document).ready(function() {
	var dir = "php/index/";

	//Comprobar si hay una sesión activa

	$.get(dir + "session_active.php", function(response){
		if(response != 0){
			window.location = "devices.html";
		}
	});

	$("#form").submit(function(e){
		const logInData = {
			username: $("#username").val(),
			password: $("#password").val()
		}

		$.post(dir + "logIn.php", logInData, function(response){
			if(response == "1"){
				window.location = "devices.html";
			}else{
				alert("Usuario o contraseña incorrecto.");
			}
		});
		e.preventDefault();
	});
});

$("input").keyup(function () { 
	let c = this.value
	let a = c[c.length - 1];
	if (a == "\"" || a == "*" || a == "\'" || a == "=") {
		c = c.substring(0, c.length -1);
		$(this).val(c);
	} 
});