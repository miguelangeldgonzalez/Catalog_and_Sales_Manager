import {s, post} from "./app.js";

export class TableList{
	constructor(button, DIR, admin, add = [], ignore = []){
		s(".card-img-top").src = "img/noImage.png";
        this.queryCard = new QueryCard(DIR);
		this.fields = [];

		s('#fields td').forEach(td => {
			this.fields.push(td.getAttribute("id"));
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
}

export class QueryCard {
	constructor(DIR){
		this.DIR = DIR;
		this.inputs = s(".form-edit");

        this.loadQuery = this.loadQuery;
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
}
