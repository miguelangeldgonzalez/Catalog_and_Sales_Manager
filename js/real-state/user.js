import { s, sA, post } from "./../app.js";
import { TableList, AddPanel } from "../contentManager.js";
import { getUser } from "../utilities.js";

const DIR = "php/real-state/";
let admin = false;

var buttons = [{
	column: "Editar",
	icon: "img/icons/edit.png",
	action: edit
}];

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

	tableList.addButtons(buttons, selection);
}

// Load User
getUser(user => {
	if (user.range > 1) {
		admin = true;

		/*let script = document.createElement("script");
		script.setAttribute("type", "module");
		script.src = 'js/real-state/root.js';
		s("body").appendChild(script);*/

		loadButtons(user.nombres + " " + user.apellidos);
		new AddPanel("#add", "#add-images", tableList, buttons, user);
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