import { s, sA, post } from "./../app.js";
import { TableList } from "../contentManager.js";
import { getUser } from "../utilities.js";
import { showControlQuery } from "./root.js";

const DIR = "php/real-state/";
let admin = false;

// Load User
getUser(range => {
	if (range > 1) {
		admin = true;

		let script = document.createElement("script");
		script.setAttribute("type", "module");
		script.src = 'js/real-state/root.js';
		s("body").appendChild(script);
	}
});

function loadMap(id){
	post(DIR + "map.php", { id }, map => {
		console.log(map);
		s("#map").innerHTML = map;
	})
}

export var tableList = new TableList({id: "cost", action: loadMap}, DIR, admin, ['loaction']);

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
