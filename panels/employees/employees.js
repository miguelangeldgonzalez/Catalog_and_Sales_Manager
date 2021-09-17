import {s, get, post} from "./../../js/app.js";

let admin = false;
let edit = false;

s(".table-control").forEach(td => {
    td.style.display = "none";
});

function deleteEmployee(id){
    if(confirm("Seguro que desea eliminar el usuario del empleado?")){
        post("delete-employee.php", {id}, function(response){
            if(response == "1"){
                fetchEmployees();
            }
        });
    }
}

function editEmployee(id){
    edit = true;

    let template = `
        <select id="s${id}" class="form-control select required">
            <option>Asesor</option>
            <option>Administracion</option>
            <option>Gerente</option>
        </select>
        <input class="btn btn-success" id="sendEdit" value="Enviar" type="button">
        <input class="btn btn-danger" id="cancelEdit" value="Cancelar" type="button">
    `;
    s("#e" + id).innerHTML = template;

    s("#cancelEdit").addEventListener("click", () => {
        fetchEmployees();
    });

    s("#sendEdit").addEventListener("click", () => {
        sendEdit(id);
    });
}

function sendEdit(id){
    let data = {
        id: id, 
        cargo: s(`#s${id}`).value
    }

    post("edit-employee.php", data, function(response){
        console.log(response);

        if(response == "1"){
            fetchEmployees();
        }
    });
}

function loadEvents(){
    s(".delete").forEach(button => {
        button.addEventListener("click", () => {
            deleteEmployee(button.getAttribute("employeeId"));
        })
    });

    s(".edit").forEach(button => {
        button.addEventListener("click", () => {
            edit ? alert("Complete la edicion o cancelela") : editEmployee(button.getAttribute("employeeId"));
        })
    });
}

function fetchEmployees(){
    edit = false;
    get("employees.php", employees => {
        let template = "";

        employees.forEach(employee => {
            template += `
            <tr>
                    <td>${employee.nombres}</td>
                    <td>${employee.apellidos}</td>
                    <td>${employee.celular}</td>
                    <td>${employee.correo}</td>
                    <td id="e${employee.id}">${employee.cargo}</td>
            `;
            
            if(admin){
                template += `
                <td><a href="#" class="edit" employeeId="${employee.id}"><img src="../../img/icons/edit.png" width="16px" height="16px"></a></td>
                <td><a href="#" class="delete" employeeId="${employee.id}"><img src="../../img/icons/x.png" width="16px" height="16px"></a></td>
                </tr>`;
            }else{
                template += "</tr>";
            }
        });
        s("#employees").innerHTML = template;

        loadEvents();
    }, true);
}

//Cerrar Sesion
s("#close").addEventListener("click", () => {
    get("../../php/close.php", () => {
        window.location = "../../index.html";
    });
});

//Carga del usuario
get("../../php/devices/user.php", response => {
    if(response == ""){
        window.location = "../../index.html";
    }

    s("#title").innerHTML = response[0].nombres;

    switch(response[0].cargo){
        case "Asesor":
            window.location = "../../devices.html";
            break;
        case "Control":
        case "Gerencia":
            s(".table-control").forEach(td => {
                td.style.display = "";
                admin = true
            });
            break;
    }

    fetchEmployees();
}, true);