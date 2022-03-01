import { s, sA, post, postForm } from "./../app.js";
import { TableList, DragHandler } from "../contentManager.js";
import { getUser } from "../utilities.js";

const DIR = "php/real-state/";
let admin = false;

function loadMap(id){
	post(DIR + "map.php", { id }, map => {
		s("#map").innerHTML = map;
	})
}

export var tableList = new TableList({id: "cost", action: loadMap}, DIR, admin, ['loaction']);

function edit(id){
	tableList.queryCard.loadQuery(id, tableList.queryCard.changeToEdition(id, ['adviser']));
}



function loadButtons(userName){
	let selection = [];
	sA("#table-list tr > td:nth-child(4)").forEach(name => {
		if(name.innerText == userName){
			selection.push(name.parentNode.getAttribute("itemId"));
		}
	});
	let buttons = [{
		column: "Editar",
		icon: "img/icons/edit.png",
		action: edit
	}]

	tableList.addButtons(buttons, selection);
}

class AddPanel{
	constructor(addForm, imageHandler){
		this.addForm = s(addForm);
		this.imageHandler = s(imageHandler);
		this.dragHandler = new DragHandler("#image-add-handler");

		this.addForm.addEventListener("submit", e => {
			e.preventDefault();
			postForm(DIR + "add.php", s("#add"), response => {
				console.log(response);
			})
		})

		this.imageHandler.onchange = () => {
			postForm(DIR + "load-temporal-add-images.php", s("#form-add-images"), images => {
				for(let i = 0; i < images.length; i++){
					this.addCardImage(i, images[i]);
				}

				s("#image-add-handler").style.display = "block";
				
				sA(".deleteImage").forEach(input => {
					input.addEventListener("click", e => {
						e.target.parentNode.remove();
					})
				})
			}, true)
		}
	}

	addCardImage(index, type){
		let template = `
			<div>
				<input type="button" class="deleteImage" style="position: absolute; background: transparent; border-color: transparent" value="X"/>
				<img src='img/tmpImageMultiple${index}${type}' class='card-img-top img-add-form' draggable='true'>
			</div>`;

		s(".images-conteiner").innerHTML += template;
	}
}

new AddPanel("#add", "#add-images");


// Load User
getUser(user => {
	if (user.range > 1) {
		admin = true;

		/*let script = document.createElement("script");
		script.setAttribute("type", "module");
		script.src = 'js/real-state/root.js';
		s("body").appendChild(script);*/

		loadButtons(user.nombres + " " + user.apellidos);
	}
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