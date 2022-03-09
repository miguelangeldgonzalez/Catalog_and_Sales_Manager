import { s, sA, post, get } from "./../app.js";
import { TableList, AddPanel } from "../contentManager.js";
import { getUser } from "../utilities.js";

const DIR = "php/real-state/";
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

function loadMap(id){
	post(DIR + "map.php", { id }, map => {
		s("#map").innerHTML = map;
	})
}

export var tableList = new TableList({id: "cost", action: loadMap}, DIR, admin, ['loaction']);

function edit(id){
	tableList.queryCard.loadQuery(id, (id, item) => {
		get(DIR + "get_all_users.php", users => {
			var actualValue = s(".adviser-select").value;

			let template = "";
			users.forEach(userOption => {
				if(userOption.id != actualValue){
					var fullname = userOption.nombres + " " + userOption.apellidos;
					template += `<option value='${userOption.id}'>${fullname}</option>`;
				}
			});
			console.log("Edit");
			s(".adviser-select").innerHTML += template;

			let location = s("#location");
	
			location.style.display = "block";	

			let noEdit = [];
			if(!admin){
				noEdit[0] = 'adviser';
			}

			tableList.queryCard.changeToEdition(id, noEdit);
			loadMap(id);

			if(item.foto != null){
				if(Object.values(item.foto) != undefined){
					let images = Object.values(item.foto);
					for(let i = 0; i < images.length; i++){
						addPanel.addCardImage(`img\\real-state-photos\\${item.id}\\${images[i]}`, "#image-edit-handler", false);
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

			addPanel.tableList.queryCard.onSubmitEdition = response => {
				let add = {location: location.value, images: []};

				sA(".temporal").forEach(img => {
					add.images.push(img.getAttribute("src"));
				});

				add.images = add.images.toString(); 

				s("#map").innerHTML = "";
				location.style.display = "none";
				s("#image-edit-handler").innerHTML = "";

				return add;
			}

			}, true);
	});
}

function deleteItem(id){
	if(confirm("Confirme que desea eliminar este registro.")){
		s(`tr[itemid="${id}"]`).remove();
	
		post(DIR + "delete.php", {id}, response => {
			if(response == 1){
				alert("El registro se ha elimindo exitosamente");
			}
		}, false);
	}
}

function loadButtons(userName){
	let selection = [];

	if(!admin){
		sA("#table-list tr > td:nth-child(4)").forEach(name => {
			if(name.innerText == userName){
				selection.push(name.parentNode.getAttribute("itemId"));
			}
		});
	}

	tableList.addButtons(buttons, selection);
}

// Load User
getUser(user => {
	if (user.range > 2) {
		admin = true;

		s(".adviser-input").remove();
	}else{
		s(".adviser-select").remove();
	}

	loadButtons(user.nombres + " " + user.apellidos);
	addPanel = new AddPanel("#add", "#add-images", tableList, buttons, user);
});

//Search
document.addEventListener("DOMContentLoaded", function () {

	s('#search').addEventListener("keyup", () => {
		let search = s('#search');

		if (search.value) {
			search = search.value;

			post(DIR + 'device-search.php', { search }, devices => {
				let template = '';

				devices.forEach(device => {
					template += `<li><a deviceId="${device.id}" class="device-search-item" href="#">${device.modelo}</a></li>`;
				});

				if (devices == '') {
					s('#container').innerHTML = `No results for the search.`;
				} else {
					s("#container").innerHTML = template;

					sA(".device-search-item").forEach(b => {
						b.addEventListener("click", () => {
							cargarConsulta(b.getAttribute("deviceId"));
						});
					});

					if(admin){
						sA(".device-search-item").forEach(b => {
							b.addEventListener("click", () => {
								let id = b.getAttribute("deviceId");
								let d = s(`tr[deviceid='${id}']`).getAttribute("d") == "true" ? false : true;
								showControlQuery(d);
							});
						});
					}
				}
				s('#search-result').style.display = "block";
			});
		} else {
			s('#search-result').style.display = "none";
		}
	});
});