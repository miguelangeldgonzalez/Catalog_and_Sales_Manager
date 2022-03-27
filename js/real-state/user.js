import { s, sA, post, get } from "./../app.js";
import { TableList, AddPanel } from "../contentManager.js";
import { getUser } from "../utilities.js";

const DIR = "php/real-state/";
var admin = false;
var addPanel = undefined;
var userData = undefined;

var buttons = [{
	column: "Editar",
	icon: "img/icons/edit.png",
	action: edit
},{
	column: "Eliminar",
	icon: "img/icons/delete.png",
	action: deleteItem
}];

function loadMap(id){
	post(DIR + "map.php", { id }, map => {
		s("#map").innerHTML = map;
	})
}

export var tableList = new TableList({id: "cost", action: loadMap}, DIR, admin, ['loaction']);

function edit(id){
	if(!tableList.queryCard.editing){
		let noEdit = [];
		if(userData.range < 3){
			noEdit[0] = 'adviser';
		}

		tableList.queryCard.changeToEdition(id, noEdit, (id, item) => {
			get("php/get_all_users.php", users => {
				var actualValue = s(".adviser-select").value;

				let template = "";
				users.forEach(userOption => {
					if(userOption.id != actualValue){
						var fullname = userOption.nombres + " " + userOption.apellidos;
						template += `<option value='${userOption.id}'>${fullname}</option>`;
					}
				});

				s(".adviser-select").innerHTML += template;

				let location = s("#location");
				location.style.display = "block";	

				loadMap(id);

				if(item.foto != null){
					if(Object.values(item.foto) != undefined){
						let images = Object.values(item.foto);
						for(let i = 0; i < images.length; i++){
							addPanel.addCardImage(`img\\real-state-photos\\${item.id}\\${images[i]}`, "#image-edit-handler", false);

							addPanel.loadEventDeleteImage();
						}
					}
				}

				s("#form-edit-image").style.display = "block";

				addPanel.loadTemporalImages(s("#edit-image"), "#image-edit-handler", "#form-edit-image", true);	

				addPanel.tableList.queryCard.editControl.onchange = () => {
					if(addPanel.tableList.queryCard.editControl.style.display == "none"){
						s("#image-add-handler").style.display = 'none';
					}
				}

				addPanel.tableList.queryCard.onCancelEdition = () => {
					s("#map").innerHTML = "";
					location.style.display = "none";
					s("#image-edit-handler").innerHTML = "";

					
				}

				addPanel.tableList.queryCard.addToSubmit = () => {
					let add = {location: s("#location-input").value};

					if(sA(".temporal").length > 0){
						add.images = [];

						sA(".temporal").forEach(img => {
							add.images.push(img.getAttribute("src"));
						});
	
						add.images = add.images.toString(); 
					}

					if(!admin){
						add.ignore = "adviser";
					}

					s("#map").innerHTML = "";
					location.style.display = "none";
					s("#image-edit-handler").innerHTML = "";

					return add;
				}

				addPanel.tableList.queryCard.onEditionSubmited = item => {
					addPanel.tableList.updateRow(item);
				}
			}, true);
		});
	}else{
		alert("Debes completar o cancelar la edición para editar otro elemento");
	}
}

function deleteItem(id){
	if(confirm("Confirme que desea eliminar este registro.")){
		s(`tr[itemid="${id}"]`).remove();
	
		post(DIR + "delete.php", {id}, response => {
			if(response == 1){
				alert("El registro se ha eliminado exitosamente");
			}
		}, false);
	}
}

function loadButtons(userName){
	var selection = [];

	if(!admin){
		sA("#table-list tr > td:nth-child(4)").forEach(name => {
			if(name.innerText == userName){
				selection.push(name.parentNode.getAttribute("itemId"));
			}
		});
	}

	tableList.addButtons(buttons, selection, admin);
}

// Load User
getUser(user => {
	switch(user.range){
		case 1:
			s("#adviser-add").remove();
			s("#adviser-edit").remove();
			buttons.splice(1, 2);
			break;
		case 2:
			admin = true;
			s("#adviser-edit").remove();
			break;
		case 3:
			admin = true;
			s(".adviser-input").remove();
			break;
	}

	userData = user;
	loadButtons(user.nombres + " " + user.apellidos);
	addPanel = new AddPanel("#add", "#add-images", tableList, buttons, user);
});