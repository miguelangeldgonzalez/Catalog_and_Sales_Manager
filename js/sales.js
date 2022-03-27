import { getUser } from './utilities.js';
import { s, post, get, postForm } from './app.js';

const DIR = "php/sales/";


class Devices{
    constructor(){
        this.selector = "#devices-sell-form";
        this.form = s(this.selector);
        this.table = new TableList("#table-devices-sells", "list_devices.php");

        get('php/get_all_users.php', users => {
            let template = "";
            
            users.forEach(user => {
                var fullname = user.nombres + " " + user.apellidos;
                template += `<option value='${user.id}'>${fullname}</option>`;
            });

            s(this.selector + " select[name='adviser']").innerHTML += template;
        }, true);

        s("#device-cancel").onclick = () => {
            this.form.reset();
        }
    }

    loadData(data){
        this.form.style.display = "block";
        s("#device")[0].value = data.marca + " " + data.modelo;
        s(`input[name="cost"]`)[1].value = data.precio;

        this.loadDefaults();

        this.form.onsubmit = e => {
            e.preventDefault();
        };

        this.form.onsubmit = e => {
            e.preventDefault();

            let add = {
                device: data.id,
                table: "D"
            }

            postForm(DIR + "add_record.php", this.form, response => {
                console.log(response);
                if(response.success){
                    this.form.reset();
                    
                    this.table.addToList(response);
                    
                    alert("Registro completado con éxito");
                }else{
                    alert("No se pudo completar el registro, recargue la página e intentelo nuevamente");
                }
            }, true, add)
        }
    }

    loadDefaults(){
        get('php/get_settings.php', settings => {
            s(`input[name='comission']`).value = settings.default_sell_comission_device;

        }, true);
    }

    hide(){
        this.form.style.display = "none";
    }
}
class RealState{
    constructor(){
        this.selector = "#real-state-sell-form";
        this.form = s(this.selector);
        this.data = undefined;
        this.add = undefined;
        this.table = new TableList("#table-real-state-sells", "list_real_state.php");

        get('php/get_all_users.php', users => {
            let template = "";
            
            users.forEach(user => {
                var fullname = user.nombres + " " + user.apellidos;
                template += `<option value='${user.id}'>${fullname}</option>`;
            });

            s(this.selector + " select[name='sell_adviser']").innerHTML += template;
        }, true);

        this.loadDefaults();

        s("#real-state-cancel").onclick = () => {
            this.form.reset();
        }
    }

    loadData(data){
        this.data = data;
        this.form.style.display = "block";

        s(`#catchment_adviser`)[0].value = data.adviser_name;
        s(`#real-state-sell-form input[name='cost']`).value = data.cost;
        s(`#real-state-sell-form input[name='sell_cost']`).value = data.cost;
        s(this.selector + " input[name='comission']").value = data.comission;
        
        let add = {
            catchment_adviser: data.adviser,
            table: "R",
            id: data.id
        };
        
        this.loadDefaults();

        this.form.onsubmit = e => {
            e.preventDefault();
        };

        this.form.onsubmit = e => {
            e.preventDefault();

            postForm(DIR + "add_record.php", this.form, response => {
                if(response.success){
                    alert("Venta añadida con éxito");
                    this.table.addToList(response);
                    this.form.reset();
                }else{
                    alert("No se pudo realizar el registro");
                }
            }, true, add)
        }
    }

    loadDefaults(){
        get('php/get_settings.php', settings => {
            s(`input[name='catchment_adviser_comission']`).value = settings.default_catchment_percentage;
            s(`input[name='sell_adviser_comission']`).value = settings.default_sell_percentage; 

        }, true);
    }

    hide(){
        this.form.style.display = "none";
    }

}

class TableList{
    constructor(table, list){
        this.fields = [];
        let elements = s(table + " thead td");
        this.table = table;

        elements.forEach(element => {
            this.fields.push(element.getAttribute("id"));
        });
        
        get(DIR + list, items => {
            items.forEach(item => {
                this.addToList(item);
                this.loadDeleteButton(item);
            })
        }, true);
    }

    addToList(item){
        let tr = document.createElement("tr");
        tr.setAttribute("itemId", item.id);

        for(let i = 0; i < this.fields.length; i++){
            let td = document.createElement("td");

            if(item[this.fields[i]] != undefined){
                td.innerText = item[this.fields[i]];
            }else{
                let input = document.createElement("input");
                input.id = item.id;
                input.type = "image";
                input.src = "img/icons/delete.png";
                input.width = 16;
                input.height = 16;

                td.appendChild(input);
            }

            tr.appendChild(td);
            s(`${this.table}`).appendChild(tr);
        }
	}

    loadDeleteButton(item){
        s(`#${item.id}`).addEventListener("click", () => {
            if(confirm("Confirme que desea eliminar el registro")){
                post(DIR + "delete_record.php", {id: item.id}, () => {
                    s(`tr[itemid='${item.id}']`).remove();
                }, false);
            }
        }, true);
    }

}

class ManageChange{
    constructor(){
        this.active = "real-state";
        this.RS = s("#change-real-state");
        this.D = s("#change-devices");

        this.RS.onclick = () => {
            if(this.active != "real-state"){
                this.changeToRealState();
            }
        }

        this.D.onclick = () => {
            if(this.active != "devices"){
                this.changeToDevices();
            }
        }
    }

    changeToRealState(){
        this.active = "real-state";
        this.RS.setAttribute("class", "btn btn-info");
        this.D.setAttribute("class", "btn btn-light");

        s("#table-real-state-sells").style.display = "block";
        s("#table-devices-sells").style.display = "none";

    }

    changeToDevices(){
        this.active = "devices";
        this.D.setAttribute("class", "btn btn-info");
        this.RS.setAttribute("class", "btn btn-light");

        s("#table-devices-sells").style.display = "block";
        s("#table-real-state-sells").style.display = "none";

    }
}

var devices = new Devices();
var realState = new RealState();
new ManageChange();


getUser(user => {
    if(user.range < 2){
        window.location = "devices.html";
    }
    
    s("#search").onclick = e => {
        let search = s("#search-input").value;
        post(DIR + "search.php", {search}, response => {
            if(response.success){
                switch(response.table){
                    case "R":
                        devices.hide();
                        realState.loadData(response);
                        break;
                    case "D":
                        realState.hide();
                        devices.loadData(response);
                        break;
                }
            }else{
                alert("No se ha encontrado ningún registro con ese ID. Verifique si el ID es correcto y vuelva a intentarlo");
            }
        }, true);
    }
});