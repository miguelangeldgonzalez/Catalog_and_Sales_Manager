var dir = "php/singUp/";
var messages = {};

function validations(data){
	let valid = false;
	
	let count = 0;
	for(var propiedad  in data){
		if(data[propiedad] == ""){
			$("#" + propiedad).attr("class", "form-control is-invalid");
			//count--;
		}else{
			$("#" + propiedad).attr("class", "form-control is-valid");
			//count++;
		}
	}

	$.ajax({
		url: dir + "user.php",
		async: false,
		method: "POST",
		data: data,
		success: function(response){
			if(!response){
				$("#username").attr("class", "form-control is-valid");
			}else{
				count--;
				$("#username").attr("class", "form-control is-invalid");

			}
		}
	});

	let a = 0;
	for(let l of data.correo){
		//Busca la cantidad de @
		if(l == "@"){
			a++;
			continue;
		}
		//Verifica que solo halla un punt despues del arroba
		if(a > 0){
			if(l == "."){
				a++;
			}
		}
	}
	
	if(a == 2){
		$("#correo").attr("class", "form-control is-valid");
		count++;
	}else{
		$("#correo").attr("class", "form-control is-invalid");
		count--;
	}
	
	let p = 0;
	
	if(data.password.length >= 5){
		p++;
		for(let l of data.password){
			let nums = /^[0-9]+$/;
			if(l.match(nums)){
				p++;
				break;
			}
		}
		for(let l of data.password){
			let letters = /^[A-Z]+$/i;
			
			if(l.match(letters)){
				p++;
				break;
			}
		}
	}
	
	if(p > 2){
		$("#password").attr("class", "form-control is-valid");
		count++;
	}else{
		$("#password").attr("class", "form-control is-invalid");
		count--;
	}
	
	let confirmPassword = $("#confirmPassword").val();
	
	if(confirmPassword == data.password){
		count ++;
		$("#confirmPassword").attr("class", "form-control is-valid");
	}else{
		count--;
		$("#confirmPassword").attr("class", "form-control is-invalid");
	}


	if(count == 3){
		return true;
	}else{
		return false;
	}
}

function confirm(){
	var data = {
		username : $("#username").val(),
		nombres : $("#nombres").val(),
		apellidos : $("#apellidos").val(),
		celular : $("#celular").val(),
		password: $("#password").val(),
		correo : $("#correo").val()
	}

	if(data.foto == ""){
		data.foto = "noImage.png";
	}
	$("#e").on("click", function(e){e.preventDefault()});
	let valid = validations(data);
	
	if(valid){
		$.post(dir + "sendForm.php", data, function(response){
			console.log(response);
			if(response == "true"){
				window.location = "devices.html";
			}
		});
	}
}