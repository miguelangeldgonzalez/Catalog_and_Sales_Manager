import {s, sA, post, postForm} from "./app.js";

export class TableList{
	constructor(button, DIR, admin, add = [], ignore = [], doAfterLoad = () => {}){
		this.rows = [];
		this.fields = [];
		this.doAfterLoad = doAfterLoad;
		this.queryCard = new QueryCard(DIR);

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

		post(DIR + "list.php", data, items => {
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
				template += `<td><a class="item_${this.fields[i]}">${item[this.fields[i]]}</a></td>`;
			}
		}	
		template += `</tr>`;

		s('#table-list').innerHTML += template;
		this.loadEvent(item.id, this.queryCard.loadQuery);
	}
	
	loadEvent(id){
		s(`tr[itemId='${id}'] a`).addEventListener("click", () => {
			this.queryCard.loadQuery(id, this.button.action);
		});
	}

	addButtons(buttons, selection = []){	
		if(selection.length == 0){
			s("#table-list tr").forEach(tr => {
				selection.push(tr.getAttribute('itemId'));
			})
		}

		for(let b = 0; b < buttons.length; b++){
			let column = document.createElement("td");
			column.innerText = buttons[b].column;
			s("#fields").appendChild(column);

			for(let select = 0; select < selection.length; select++){
				this.loadButton(buttons[b], selection[select]);
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
}

export class QueryCard {
	constructor(DIR){
		this.DIR = DIR;
		this.editing = false;
		this.form = s("#edit");
		this.inputs = s(".form-edit");
        this.loadQuery = this.loadQuery;
		this.editControl = s(".edit-control");
		this.editControl.style.display = "none";
		this.cardImage = s(".card-img-top");
		this.changeImageButton = s("#edit-image");

		this.cardImage.src = "img/noImage.png";
		s(".edit-control #cancelar").addEventListener("click", () => {
			this.cancelEdition();
		})
	}

	loadQuery(id, action = () => {}) {
		post(this.DIR + "single.php", { id }, item => {
			this.inputs.forEach(input => {
				input.value = item[input.getAttribute("name")];
			});

			if (item.foto == undefined) {
				s(".card-img-top").src = "img/noImage.png";
			} else {
				s(".card-img-top").src = "img/phones/" + item.id + item.foto;
			}

            action(id);
		});
	}

	changeToEdition(id, noEdit = []){
		this.editing = true;
		this.editControl.style.display = "block";
		this.form.reset();
		this.loadQuery(id);
		this.changeImageButton.style.display = "block";

		this.inputs.forEach(input => {
			let name = input.getAttribute("name");
			console.log(noEdit.indexOf(name));
			if(name != "id" && noEdit.indexOf(name) == -1){
				input.removeAttribute("readonly");
			}
		});	

		this.form.addEventListener("submit", e => {
			e.preventDefault();

			postForm(this.DIR + "edit.php", this.form, response => {
				if(response == "1"){
					alert("Edición correcta");
					this.cancelEdition();
					this.editing = false;
				}else{
					alert("La edición no se pudo completar");
				}
			})	
		})
	}

	cancelEdition(){
		this.form.reset();
		this.editing = false;
		this.editControl.style.display = "none";
		this.changeImageButton.style.display = "none";
		
		this.inputs.forEach(input => {
			input.setAttribute("readonly", "false");
		});
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