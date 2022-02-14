import { s, post, get, postForm } from "./app.js";
import {createModal, confirmPassword} from "./utilities.js";

let user = undefined;
let edit = false;

const DIR = "php/profile/";

//Cerrar Sesion
function closeSession() {
    get("php/close.php", () => {
        window.location = "index.html";
    });
}

function editInformation() {
    if (!edit) {
        edit = true;
        let buttons = s("#main-form .form-control");

        s("#edit").style.display = "none";
        s("#send").style.display = "";

        buttons.forEach(button => {
            if (button.getAttribute("name") != "cargo") {
                button.removeAttribute("readonly");
            }
        });


        s("#main-form").addEventListener("submit", e => {
            e.preventDefault();
            buttons.forEach(button => {
                if (button.value == "") {
                    button.value = user[button.getAttribute("name")];
                }
            });

            postForm(DIR + "send-form.php", s("#main-form"), response => {
                if (response == "false") {
                    alert("Nombre de usuario ya existe");
                }
                if (response == "true") {
                    s("#edit").style.display = "";
                    s("#send").style.display = "none";

                    buttons.forEach(button => {
                        if (button.getAttribute("name") != "cargo") {
                            button.setAttribute("readonly", "true");
                        }
                    });
                    loadUser();
                    edit = false;
                }
            });
        });
    }
}

function editPhoto() {
    postForm(DIR + "change-image.php", s("#main-form"), response => {
        console.log(response);
        switch (response) {
            case ".jpg":
            case ".png":
                alert("Imagen editada correctamente");
                let src = "img/profiles-photos/" + user.username + response + "?nocache=" + Math.random();
                s(".card-img-top").setAttribute("src", src);
                s("input[name='image'").value = "";
                break;
            case "1":
                alert("La imagen supera los 3MB");
                break;
            case "2":
                alert("La imagen tiene un formato no admitido");
                break;
            default:
            case "3":
                alert("Operación fallida");
                break;
        }
    });
}
function deletePhoto() {
    get(DIR + "delete-photo.php", () => {
        s(".card-img-top").setAttribute("src", "img/noImageProfile.png");
    })
}

function changePassword(){
    let add = {username: user.username}
    if(confirmPassword(s("input[name='new-password']"), s("#confirm-password"))){
        postForm(DIR + "change-password.php", s("#password-form"), response => {
            console.log(response);
            if(response == "1"){
                alert("La contraseña ha sido cambiada exitosamente");
                s("input[name='password']").className = "form-control is-valid";
            }else{
                s("input[name='password']").className = "form-control is-invalid";
            }
            
        }, false, add);
    }
}

s("#close").addEventListener("click", () => {
    closeSession();
});
s("#edit").addEventListener("click", () => {
    editInformation();
});
s("input[name='image']").addEventListener("change", () => {
    editPhoto();
});
s("#delete-image").addEventListener("click", () => {
    deletePhoto();
});
s("#password-form").addEventListener("submit", e => {
    e.preventDefault();
    changePassword();
})

function loadUser() {
    get("php/user.php", response => {
        if (response == "") {
            window.location = "index.html";
        }

        if(user == undefined){
            user = response[0];

            let add = "";
            let nav = s("#nav").innerHTML;
    
            if (user.cargo == "Administracion" || user.cargo == "Gerencia" || user.cargo == "Control") {
                add = nav + "<li class='nav-item'><a class='nav-link' href='panels/employees/employees.html'>Empleados</a></li>";
            } else {
                add = nav;
            }
    
            s("#nav").innerHTML = add;
        }else{
            user = response[0];
        }

        s("#title").innerHTML = user.nombres;



        if (user.foto != "") {
            s(".card-img-top").setAttribute("src", "img/profiles-photos/" + user.username + user.foto + "?nocache=" + Math.random());
        }

        s("#main-form .form-control").forEach(button => {   
            button.value = user[button.getAttribute("name")];
        });

    }, true);
}

loadUser();
createModal("#modal-change-password", "#change-password", false);