let admin = false;
let edit = false;

$("table-control").hide();

function fetchEmployees(){
    edit = false;
    $.get("employees.php", function(response){
        let template = "";
        let employees = JSON.parse(response);

        employees.forEach(employee => {
            template += `
            <tr>
                    <td>${employee.nombres}</td>
                    <td>${employee.apellidos}</td>
                    <td>${employee.celular}</td>
                    <td>${employee.correo}</td>
                    <td id="${employee.id}">${employee.cargo}</td>
            `;
            
            if(admin){
                template += `
                <td><a href="#" class="edit" employeeId="${employee.id}"><img src="../../img/icons/edit.png" width="16px" height="16px"></a></td>
                <td><a href="#" class="delete" employeeId="${employee.id}"><img src="../../img/icons/x.png" width="16px" height="16px"></a></td>
                `;
            }
        });
        $("#employees").html(template);
    });
}

//Eliminar usuario
$(document).on("click", ".delete", function(){
    let id = $(this).attr("employeeId");

    if(confirm("Seguro que desea eliminar el usuario del empleado?")){
        $.post("delete-employee.php", {id}, function(response){
            if(response == "1"){
                fetchEmployees();
            }
        });
    }
});

//editar usuario
$(document).on("click", ".edit", function(){
    edit = true;
    let id = $(this).attr("employeeId");

    let template = `
        <select class="form-control select required">
            <option>Asesor</option>
            <option>Administracion</option>
            <option>Gerente</option>
        </select>
        <input class="btn btn-success" value="Enviar" onclick="sendEdit(${id})" type="button">
        <input class="btn btn-danger" value="Cancelar" type="button" onclick="fetchEmployees()">
    `;

    $("#" + id).html(template);
});

function sendEdit(id){
    let data = {
        id: id, 
        cargo: $(".select").val()
    }

    $.post("edit-employee.php", data, function(response){
        console.log(response);

        if(response == "1"){
            fetchEmployees();
        }
    });
}

//Cerrar Sesion
$("#close").on("click", function(){
    $.get("../../php/close.php", function(){
        window.location = "../../index.html";
    });
});

//Carga del usuario
$.get("../../php/home/user.php", function(response){
    if(response == ""){
        window.location = "../../index.html";
    }

    let data = JSON.parse(response)[0];
    $("#title").html(data.nombres);

    switch(data.cargo){
        case "Asesor":
            window.location = "../../home.html";
            break;
        case "Control":
        case "Gerencia":
            $("table-control").hide();
            admin = true;
            break;
    }

    fetchEmployees();
});