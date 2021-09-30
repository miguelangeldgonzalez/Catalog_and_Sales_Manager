import {s} from "./app.js";

export function createModal(modalDiv, openModal, windowClick = true){
    let close = s(modalDiv + " .close");
    let open = s(openModal);
    let modal = s(modalDiv);
    let modalC = modal.parentNode;
    
    open.addEventListener("click", e => {
        e.preventDefault();
    
        modalC.style.opacity = "1";
        modalC.style.visibility = "visible";
    
        modal.classList.toggle("modal-close");
    
    });
    close.addEventListener("click", e => {
        modal.classList.toggle("modal-close");
        setTimeout(() => {
            modalC.style.opacity = "0";
            modalC.style.visibility = "hidden";
        }, 500)
    });

    if(windowClick){
        window.addEventListener("click", e => {
            if (e.target == modalC) {
                modal.classList.toggle("modal-close");
                setTimeout(() => {
                    modalC.style.opacity = "0";
                    modalC.style.visibility = "hidden";
                }, 500)
            }
        });
    }
}

export function confirmPassword(password, passwordConfirmButton){
    let count = 0;

    let p = 0;
    if(password.value.length >= 5){
		p++;
		for(let l of password.value){
			let nums = /^[0-9]+$/;
			if(l.match(nums)){
				p++;
				break;
			}
		}
		for(let l of password.value){
			let letters = /^[A-Z]+$/i;
			
			if(l.match(letters)){
				p++;
				break;
			}
		}
	}
	
	if(p > 2){
		password.className = "form-control is-valid";
		count++;
	}else{
		password.className = "form-control is-invalid";
		count--;
	}
	
	if(passwordConfirmButton.value == password.value && password.value != ""){
		count++;
		passwordConfirmButton.className = "form-control is-valid";
	}else{
		count--;
		passwordConfirmButton.className = "form-control is-invalid";
	}

    if(count == 2){
        return true;
    }else{
        return false;
    }
}
