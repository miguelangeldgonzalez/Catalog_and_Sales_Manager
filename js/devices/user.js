import { s, get, post, postForm } from "./../app.js";
import { getUser } from "../utilities.js";
import { TableList, AddPanel } from "../contentManager.js";

const DIR = "php/devices/";
var admin = false;
var addPanel = undefined;

var buttons = [{
	column: "Editar",
	icon: "img/icons/edit.png",
	action: edit
},{
	column: "Eliminar",
	icon: "img/icons/delete.png",
	action: deleteItem
}];

class Availibility{
	constructor(){
		this.button = s("#availibility");
		this.availible = 0;
	}

	hide(){
		this.button.style.display = "none";
		this.button.onclick = () => {};
	}

	show(id){
		post(DIR + "get_availibility.php", {id}, availibility => {
			this.button.style.display = "block";
			this.availible = availibility;
			availibility == 1 ? this.isAvailible() : this.isNotAvailible();

			this.button.onclick = () => {};
			this.button.onclick = () => {
				let data = {
					id: id,
					d: availibility == 1 ? 0 : 1
				}

				post(DIR + "change_availibility.php", data, availibility => {
					this.show(id);
				})
			}
		})
	}

	isAvailible(){
		this.success("Disponible");

		this.button.onmouseover = () => {
			this.danger("Marcar como no disponible");
		}

		this.button.onmouseleave = () => {
			this.success("Disponible");
		}
	}

	isNotAvailible(){
		this.danger("No Disponible");
		
		this.button.onmouseover = () => {
			this.success("Marcar como Disponible");
		}

		this.button.onmouseleave = () => {
			this.danger("No Disponible");
		}
	}

	success(text){
		this.button.innerText = text;
		this.button.classList.add("btn-success");
		this.button.classList.remove("btn-danger");
	}

	danger(text){	
		this.button.innerText = text;
		this.button.classList.add("btn-danger");
		this.button.classList.remove("btn-success");
	}
}

var availibility = new Availibility();

export var tableList = new TableList({id: "modelo", action: () => {} }, DIR, admin);

tableList.queryCard.onLoadQuery = (id, item) => {
	availibility.show(id);
}

function deleteItem(id){
	if(!tableList.queryCard.editing){
		if(confirm("Confirme que desea eliminar el dispositivo del registro")){
			post(DIR + "delete.php", {id}, () => {
				s(`tr[itemid="${id}"]`).remove();
			})
		}
	}else{
		alert("Debes completar o cancelar la edición para continuar");
	}
	
}

function edit(id){
	if(!tableList.queryCard.editing){
		tableList.queryCard.changeToEdition(id, [], (id, item) => {
			s("#form-edit-image").style.display = "block";

			s("#edit-image").oninput = () => {
				postForm(DIR + "load_temporal_edit_image.php", s("#form-edit-image"), response => {
					s("#query-image").setAttribute("src", "img/tmpImage_0_" + response.split("\"")[1]);
				})
			}
		});

		tableList.queryCard.addToSubmit = () => {
			let add = {};

			if(s("#query-image").getAttribute("src").split("_")[0] == "img/tmpImage"){
				add.image = s("#query-image").getAttribute("src").split("_")[2];
			}

			return add;
		}

		tableList.queryCard.onEditionSubmited, tableList.queryCard.onCancelEdition = () =>{
			s("#query-image").setAttribute("src", "img/noImage.png");
			s("#form-edit-image").style.display = "none";
			availibility.hide();
		}
	}else{
		alert("Debes completar o cancelar la edición para editar otro elemento");
	}
}

//Cerrar Sesion
function closeSession() {
	get("php/close.php", r => {
		window.location = "index.html";
	});
}

s("#close").addEventListener("click", () => {
	closeSession();
});

// Load User
getUser(user => {
	if (user.range > 1) {
		admin = true;

		get("panels/devices/add.html", (e) => {
			s(".col-md-7 div")[3].innerHTML = e;

			tableList.addButtons(buttons, [], admin);
			addPanel = new AddPanel("#add", "#add-images", tableList, buttons, user);
		});
	}	
});