import {s, sA, post, postForm, get} from "./app.js";

export class TableList{
	constructor(button, DIR, admin, add = [], ignore = [], doAfterLoad = () => {}){
		this.rows = [];
		this.fields = [];
		this.DIR = DIR;
		this.doAfterLoad = doAfterLoad;
		this.queryCard = new QueryCard(this.DIR);

		s('#fields td').forEach(td => {
			if(td.getAttribute("id") != ""){
				this.fields.push(td.getAttribute("id"));
			}
		})
		
		if(add.length != 0){
			this.fields.concat(add);
		}
		
		if(ignore.length != 0){
			ignore.forEach(field => {
				if(this.fields.includes(field)){
					this.fields.splice(this.fields.indexOf(field), 1);
				}
			})
		}

		this.button = button;
		this.buttonPosition = this.setButtons(button);

		let data = {
			admin: admin,
			fields: this.fields
		}

		post(this.DIR + "list.php", data, items => {
			items.forEach(item => this.addToList(item));
			items.forEach(item => this.loadEvent(item.id, button.action));

			this.rows = s("#fields #table-list");
			this.doAfterLoad();
		}, true);
	}

	//find the buttons in the field's list
	setButtons(button){
		if(this.fields.includes(button.id)){
			return this.fields.indexOf(button.id);		
		}else{
			return undefined;
		}
	}

	//Add an element to the list
	addToList(item){
		let template = `<tr itemId="${item.id}">`;

		for(let i = 0; i < this.fields.length; i++){
			if(i != this.buttonPosition){
				template += `<td>${item[this.fields[i]]}</td>`;
			}else{
				template += `<td><a style="cursor:pointer;" class="item_${this.fields[i]}">${item[this.fields[i]]}</a></td>`;
			}
		}	
		template += `</tr>`;

		s('#table-list').innerHTML += template;
		this.loadEvent(item.id, this.queryCard.loadQuery);
	}
	
	loadEvent(id){
		s(`tr[itemId='${id}'] a`).addEventListener("click", () => {
			this.queryCard.loadQuery(id, this.button.action, false);
		});
	}

	addButtons(buttons, selection = [], admin = false){	
		if(selection.length != 0 || admin){
			if(admin){
				s("#table-list tr").forEach(tr => {
					selection.push(tr.getAttribute('itemId'));
				});
			}

			for(let b = 0; b < buttons.length; b++){
				if(sA(`tr input[src='${buttons[b].icon}']`).length == 0){
					let column = document.createElement("td");
					column.innerText = buttons[b].column;
					s("#fields").appendChild(column);
				}
	
				for(let select = 0; select < selection.length; select++){
					this.loadButton(buttons[b], selection[select]);
				}
			}
		}

	}

	loadButton(buttonData, id){
		let button = document.createElement("td");
		button.innerHTML = `<input type='image' src='${buttonData.icon}' width='16' height='16'>`;
		s(`tr[itemId='${id}']`).appendChild(button);

		s(`tr[itemId='${id}'] td input[src='${buttonData.icon}']`).addEventListener("click", () => {
			buttonData.action(id);
		});
	}

	updateRow(item){
		for(let i = 0; i < this.fields.length; i++){
			let j = i + 1;
			if(i == this.buttonPosition){
				s(`tr[itemid='${item.id}'] td:nth-child(${j})`).innerHTML = `<a class="item_${this.fields[i]}">${item[this.fields[i]]}</a>`;
				this.loadEvent(item.id);
			}else{
				s(`tr[itemid='${item.id}'] td:nth-child(${j})`).innerText = item[this.fields[i]];
			}
		}
	}
}

export class QueryCard {
	constructor(DIR){
		this.DIR = DIR;
		this.editing = false;
		this.form = s("#edit");
		this.inputs = s(".form-edit");
        this.loadQuery = this.loadQuery;
		this.cardImage = s(".card-img-top");
		this.editControl = s(".edit-control");
		this.editControl.style.display = "none";
		this.changeImageButton = s("#edit-image");

		this.addToSubmit = () => {};
		this.onLoadQuery = () => {};
		this.onCancelEdition = () => {};
		this.onEditionSubmited = () => {};

		this.cardImage.src = "img/noImage.png";
		s(".edit-control #cancelar").addEventListener("click", () => {
			this.cancelEdition();
		})
	}

	loadCarrousel(images, id){
		const carrousel = s(".carrousel");

        var numberOfImages = images.length;
		let imagesTemplate = "";

		carrousel.innerHTML = "";

		for(let i = 0; i < numberOfImages; i++){
			imagesTemplate += `<img class="card-img-top" src="img/real-state-photos/${id}/${images[i]}">`
		}

		carrousel.innerHTML = imagesTemplate;

        var porcentajeMovimiento = (1 / numberOfImages) * 100;
        var posicion = 0;

        carrousel.style.width = (numberOfImages * 100) + "%";

        document.querySelectorAll(".carrousel img").forEach(img => {
            img.style.width = `calc(100% / ${numberOfImages})`;
        });

		carrousel.style.transform = `translateX(0%)`;
		s("#query-image").style.display = "none";

		if(!s(".front").onclick){
			s(".front").onclick = () => {};
			s(".back").onclick = () => {};
		}

		s(".front").onclick = () => {
			if(posicion > -((numberOfImages - 1) * porcentajeMovimiento)){
				posicion -= porcentajeMovimiento;
				carrousel.style.transform = `translateX(${posicion}%)`;
			}
		};

		s(".back").onclick = () => {
			if(posicion < 0){
				posicion += porcentajeMovimiento;
				carrousel.style.transform = `translateX(${posicion}%)`;   
			}
		};
	}

	loadQuery(id, action = () => {}, allowEditing = true) {
		if((!this.editing && !allowEditing) || (this.editing && allowEditing)){
			post(this.DIR + "single.php", { id }, item => {
				this.inputs.forEach(input => {
					input.value = item[input.getAttribute("name")];
	
					if(input.tagName == "SELECT"){
						input.innerHTML = `<option value='${item.adviser_id}'>${item[input.getAttribute("name")]}</option>`;
					}
				});
	
				if(item.foto == undefined){
					s("#query-image").setAttribute("src", `img/noImage.png`);
				}else{
					if(typeof item.foto == 'string'){
						s("#query-image").setAttribute("src", `img/phones/${item.id}${item.foto}`);
					}else{
						if(Object.values(item.foto).length > 0){
							this.loadCarrousel(Object.values(item.foto), item.id);
						}
					}
				}
				
				action(id, item);
				this.onLoadQuery(id, item);
			});
		}else{
			alert("Debes completar o cancelar la edición para continuar");
		}
	}

	changeToEdition(id, noEdit = [], doAfter = () => {}){
		this.editing = true;
		this.editControl.style.display = "block";
		this.form.reset();
		this.loadQuery(id, doAfter);
		this.changeImageButton.style.display = "block";

		this.inputs.forEach(input => {
			let name = input.getAttribute("name");
			if(name != "id" && noEdit.indexOf(name) == -1){
				input.removeAttribute("readonly");
			}
		});	

		this.form.onsubmit = () => {};

		this.form.onsubmit = e => {
			e.preventDefault();
			
			let add = this.addToSubmit(); 

			postForm(this.DIR + "edit.php", this.form, item => {
				if(item.success){
					alert("Edición realizada con éxito.");
					this.cancelEdition();
					this.editing = false;
				}else{
					alert("La edición no se pudo completar");
				}

				this.onEditionSubmited(item);
			}, true, add);	
		}
	}

	cancelEdition(){
		this.form.reset();
		this.editing = false;
		this.editControl.style.display = "none";
		this.changeImageButton.style.display = "none";
		s("#query-image").style.display = "block";
		s(".carrousel").innerHTML = "";
		
		this.inputs.forEach(input => {
			input.setAttribute("readonly", "false");
		});

		this.onCancelEdition();
	}
}

export class DragHandler{
	constructor(element){
		this.conteiner = s(element);

		this.moveElement = undefined;
		this.toElement = undefined;

		this.conteiner.addEventListener("dragstart", e => { this.moveElement = e.target });

		this.conteiner.addEventListener("dragover", e => { 
			e.preventDefault();
			this.toElement = e.target; 
		});

		this.conteiner.addEventListener("drop", e => {
			if(this.toElement.tagName == "DIV"){
				if(this.moveElement.tagName == "DIV"){
					this.toElement.appendChild(this.moveElement);
				}else{
					this.toElement.appendChild(this.moveElement.parentNode);
				}
			}else{
				this.toElement.parentNode.appendChild(this.moveElement);
			}
		});
	}
}

export class AddPanel{
	constructor(addForm, imageHandler, tableList, buttons, userData){
		this.buttons = buttons;
		this.addForm = s(addForm);
		this.tableList = tableList;
		this.DIR = this.tableList.DIR;
		this.imageHandler = s(imageHandler);

		if(userData.range > 1){
			get("php/get_all_users.php", users => {
				let template = "";
				users.forEach(userOption => {
					var fullname = userOption.nombres + " " + userOption.apellidos;
					template += `<option value='${userOption.id}'>${fullname}</option>`;
					
				});

				s(".adviser-add-select").innerHTML += template;
			}, true);
		}

		this.addForm.addEventListener("submit", e => {
			e.preventDefault();
			let data = {};

			let images = [];
			
			sA("#image-add-handler img").forEach(img => {
				images.push(img.getAttribute("src").split("_")[1] + "_" + img.getAttribute("src").split("_")[2]);
			});

			if(images.length > 0){
				data.images = JSON.stringify(images);
			}
			
			userData.range < 2 ? data.adviser = userData.id : false;

			postForm(this.DIR + "add.php", s("#add"), item => {
				console.log(item);
				this.tableList.addToList(item);
				this.tableList.addButtons(this.buttons, [item.id]);

				s("#image-add-handler").style.display = "none";
				s("#add").reset();
				
				sA("#image-add-handler img").forEach(img => {
					img.parentNode.remove();
				});
			}, true, data);
		})

		this.loadTemporalImages(this.imageHandler, "#image-add-handler", "#form-add-images");
	}

	loadTemporalImages(button, placeToLoad, formFromLoad, allowEditing = false){
		button.oninput = () => {
			let last = undefined;
			let images = sA(placeToLoad + " .temporal");
			
			if(this.tableList.queryCard.editing && !allowEditing){
				alert("Estas editando, debes completar la edición o cancelarla antes de continuar con esta acción");
			}else{
				if(s(".last-place-loaded").length != 0 && s(placeToLoad + ".last-place-loaded").length == 0){
					console.log("Entró");
					s(".last-place-loaded div").forEach(div => {
						div.remove();
					});
					s(".last-place-loaded").style.display = "none";
					s(".last-place-loaded").classList.remove("last-place-loaded");
				}else{
					s(placeToLoad).classList.add("last-place-loaded");
				}
	
				s(".last-place-loaded") ? s(placeToLoad) : false;
	
				if(images.length != 0){
					let identifiers = [];
					images.forEach(image => {
						identifiers.push(parseInt(image.getAttribute("src").split("_")[1]));
					});
		
					last = Math.max(...identifiers) + 1;
				}
				
				postForm(this.DIR + "load-temporal-add-images.php", s(formFromLoad), images => {
					if(button.getAttribute("multiple") != null){
						images.forEach(image => {
							this.addCardImage(`img\\tmpImageMultiple_${image.id}_${image.format}`, placeToLoad);
						});
					}else{
						this.addCardImage("img\\tmpImage_0_" + images[0], placeToLoad);
					}
	
					s(placeToLoad).style.display = "inline-block";
					
					this.loadEventDeleteImage();
	
				}, true, {last})
			}
		}
	}

	loadEventDeleteImage(){
		sA(".deleteImage").forEach(input => {
			input.onclick = () => {};
			input.onclick = e => {
				let data = {
					source: e.target.getAttribute("source")
				}

				post(this.DIR + "delete-temporal-image.php", data, () => {
					e.target.parentNode.remove();
				}, false)
			}
		})
	}

	getImagesId(type){
		let identifiers = [];

		if(!!sA(`#${type} img`)){
			sA(`#${type} img`).forEach(img => {
				let source = img.getAttribute("src");
				identifiers.push({
					id: source.split("_")[1],
					type: source.split("_")[2]
				});
			});
		}
		return identifiers;
	}

	addCardImage(source, placeToLoad, temporal = true){

		let template = `
			<div>
				<input type="button" class="deleteImage" style="position: absolute; background: transparent; border-color: transparent" value="X" source='${source}'/>
				<img src='${source}' class='card-img-top img-add-form ${temporal ? "temporal" : ""}'>
			</div>`;

		s(placeToLoad).innerHTML += template;
	}
}