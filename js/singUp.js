import {s, postForm} from "./app.js";

const DIR = "php/singUp/";

async function validations(data){
	let count = 0;

	//Verificar que todos los campos esten completos
	for(let key of data.keys()){
		if(s(`input[name='${key}']`).value == ""){
			s(`input[name='${key}']`).className = "form-control is-invalid";
		}else{
			s(`input[name='${key}']`).className = "form-control is-valid";
		}
	}

	//Verificar el nombre de usuario
	await fetch(DIR + "user.php", {method: 'POST', body: data})
		.then(r => r.text())
		.then(response => {
			if(response == ""){
				s(`input[name='username']`).className =  "form-control is-valid";
			}else{
				count--;	
				s(`input[name='username']`).className = "form-control is-invalid";
			}
		});
	
	let a = 0;

	for(let l of data.get("correo")){
		//Busca la cantidad de @
		if(l == "@"){
			a++;
			continue;
		}
		//Verifica que solo halla un punto despues del arroba
		if(a > 0){
			if(l == "."){
				a++;
			}
		}
	}
	
	if(a == 2){
		s("input[name='correo']").className = "form-control is-valid";
		count++;
	}else{
		s("input[name='correo']").className = "form-control is-invalid";
		count--;
	}
	
	let p = 0;
	let password = data.get("password");

	if(password.length >= 5){
		p++;
		for(let l of password){
			let nums = /^[0-9]+$/;
			if(l.match(nums)){
				p++;
				break;
			}
		}
		for(let l of password){
			let letters = /^[A-Z]+$/i;
			
			if(l.match(letters)){
				p++;
				break;
			}
		}
	}
	
	if(p > 2){
		s("input[name='password']").className = "form-control is-valid";
		count++;
	}else{
		s("input[name='password']").className = "form-control is-invalid";
		count--;
	}
	
	if(s("#confirmPassword").value == password){
		count ++;
		s("#confirmPassword").className = "form-control is-valid";
	}else{
		count--;
		s("#confirmPassword").className = "form-control is-invalid";
	}


	if(count == 3){
		return true;
	}else{
		return false;
	}
}

s("#formulario").addEventListener("submit", e => {
	e.preventDefault();
	var data = new FormData(s("#formulario"));

	validations(data).then(valid => {
		if(valid){
			postForm(DIR + "sendForm.php", s("#formulario"), response => {
				if(response == "true"){
					window.location = "devices.html";
				}
			});
		}
	})
});