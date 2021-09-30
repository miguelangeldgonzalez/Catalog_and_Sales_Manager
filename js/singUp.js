import {s, postForm, get} from "./app.js";

const DIR = "php/singUp/";

export async function validations(data){
	let count = 0;

	//Verificar que todos los campos esten completos
	for(let key of data.keys()){
		let input = s(`input[name='${key}']`);
		if(input.value == "" && input.type != "file"){
			input.className = "form-control is-invalid";
		}else{
			input.className = "form-control is-valid";
		}
	}

	//Verificar el nombre de usuario
	await fetch(DIR + "validate-user.php", {method: 'POST', body: data})
		.then(r => r.text())
		.then(response => {
			if(response == "" && s("input[name='username']").value != ""){
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
	}
	
	if(a == 1){
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
	
	if(s("#confirmPassword").value == password && password != ""){
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
s("input[name='image']").addEventListener("change", () => {
	postForm(DIR + "validate-image.php", s("#formulario"), response => {
		switch(response){
			case "jpg":
			case "png":
				s(".card-img-top").setAttribute("src", "img/tmpImage." + response);
				break;
			case "1":
				alert("La imagen supera los 3MB");
				break;
			default:
			case "2":
				alert("La imagen tiene un formato no admitido");
				break;
		}
	});
});

s("#delete-image").addEventListener("click", () =>{
	get("php/devices/delete-edit-image.php", () => {
		s(".card-img-top").setAttribute("src", "img/noImageProfile.png");
	})
});

s("#formulario").addEventListener("submit", e => {
	e.preventDefault();
	var data = new FormData(s("#formulario"));

	validations(data).then(valid => {
		if(valid){
			postForm(DIR + "send-form.php", s("#formulario"), response => {
				if(response == "true"){
					window.location = "devices.html";
				}
			});
		}
	})
});