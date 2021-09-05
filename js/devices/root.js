var html;
$.ajax({
	url: "js/devices/html.json",
	async: false,
	type: "GET",
	success: function(response){
		html = JSON.parse(response);
	}
})

$(".fetch").attr("class", "col-6 fetch p-0");
$(".fetch").after(html.tableControl);

$.get("panels/add/add.html", function(response){
    $(".row-fetch").after(response);
});

//Cargar controles de la lista
function showControlDevices(){
	cancelEdit();
    $.post(dir + "device-list.php", {admin : true}, function(response){
        let devices = JSON.parse(response);
        let template = "";
        
        devices.forEach(device => {
            template += "<tr>";

            if(device.disponible == "1"){
                template += `<td><img src="img/icons/check.png" height="16px" width="16px"></td>`;
				$("a[deviceId='"+device.id+"'][class='device-item']").attr("d", "1");
            }else{
                template += `<td><img src="img/icons/x.png" height="16px" width="16px"></td>`;
				$("a[deviceId='"+device.id+"'][class='device-item']").attr("d", "0");
            }

            template += `<td><a href="#" class="delete" deviceId="${device.id}"><img height="16px" width="16px" src="img/icons/delete.png"></a></td><td><a href="#" class="edit" deviceId="${device.id}"><img height="16px" width="16px" src="img/icons/edit.png"></a></td></tr> `;
        });

        $('#controls').html(template);
        
    });
}
$(document).ready(function(){
	showControlDevices();
})

//Cargar control de la consulta
function showControlQuery(d){
	cancelEdit();
	if(d == 1){
		$("#disponible").attr("class", "btn btn-success");
		$("#disponible").attr("value", "Disponible");
		$("#disponible").attr("d", "true");
	}else{
		$("#disponible").attr("class", "btn btn-warning");
		$("#disponible").attr("value", "No Disponible");
		$("#disponible").attr("d", "false");
	}
	$("#disponible").css("visibility", "visible");
}

$(document).on('click', '.device-item', function(){
	let d = $(this).attr('d');
	showControlQuery(d);
});

//Manejo de disponibilidad
$("#disponible").on("click", function(){
	let data = {
		d: 0,
		id: $("#id").html()
	}

	if($("#disponible").attr("d") == "false"){
		data.d = 1;
	}
	
	$.post(dir + "disponibilidad.php", data, function(){
		cargarConsulta(data.id);
		fetchDevices();
        showControlDevices();
		showControlQuery(data.d);
	})
});

$("#disponible").mouseenter(function(){
	let val = $("#disponible").attr("d");
	if(val == "true"){
		$("#disponible").attr("value", "Marcar Como No Disponible");
	}else{
		$("#disponible").attr("value", "Marcar Como Disponible");
	}
});
	
$("#disponible").mouseout(function(){
	let val = $("#disponible").attr("d");
	if(val == "true"){
		$("#disponible").attr("value", "Disponible");
	}else{
		$("#disponible").attr("value", "No Disponible");
	}
});

//Eliminar
$(document).on('click','.delete', function(){
    if(confirm("Deseas eliminarlo?")){
        let id = $(this).attr('deviceId');
        $.post(dir + 'device-delete.php', {id}, function(response){
            showControlDevices();
            fetchDevices();
        });
    }
});

//Cargar el Formulario de Edición
$(document).on('click','.edit', function(){
	$("#disponible").css("visibility", "hidden");
	$("#form-edit-image").show();

    $(".form-edit").html("<input class='input-group-text w-75 form-input-edit' type='text'>");

	for(i = 2; i < 5; i++){
		$(".form-edit")[i].innerHTML = "<input class='input-group-text w-75 form-input-edit' type='number'>";
	}

	$(".form-edit")[6].innerHTML = html.formEditCamara;

	$(".form-edit")[7].innerHTML = html.formEditProcesador;

	let id = $(this).attr('deviceId');
		
	$.post(dir + 'device-single.php', {id}, function(response){
		let device = JSON.parse(response)[0];
		let keys = Object.keys(device);
        
		let camara = JSON.parse(device.camara);
		$("input[name='camaraFrontal']").val(camara.front);
		$("input[name='camaraTrasera']").val(camara.back);
        
		let procesador = JSON.parse(device.procesador);
		$("input[name='procesadorNombre']").val(procesador.name);
		$("input[name='procesadorGHZ']").val(procesador.GHZ);
			
		let inputs = $(".form-input-edit");


		for(let i = 0; i < 6; i++){
			inputs[i].value = device[keys[i]]; 
            inputs[i].name = keys[i];
		}
		
		inputs[10].name = "id";
		inputs[10].value = device.id;
		inputs[10].setAttribute("readonly", true);

		if(device.foto == undefined){
			$(".card-img-top").attr("src", "img/noImage.png");
		}else{
			$(".card-img-top").attr("src", "img/phones/" + device.id + device.foto);
		}
		let buttons = html.editControl;
	
		$("#send-edit").append(buttons);
	});
});

//Cargar Edición de la Imagen
$("#edit-image").on("change", function(){
	var foto = new FormData($("#form-edit-image")[0]);

	$.ajax({
		type: "POST",
		url: dir + "device-edit-image.php",
		data: foto,
		contentType: false, 
		processData: false,
		beforeSend: function(){

		},
		success: function(response){
			switch(response){
				case "1":
					alert("Formato de imagen no admitido");
					$("#edit-image").val("");
					break;
				case "2":
					alert("Tamaño de imagen no admitido");
					$("#edit-image").val("");
					break;
				case ".jpg":
				case ".png":
					$(".card-img-top").attr("src", "img/tmpImage" + response);		
			}
		}
	})
});

//Enviar Edición
$("#send-edit").submit(function(e){
	e.preventDefault();

	$.ajax({
		url: dir + "device-edit.php",
		data: new FormData($("#send-edit")[0]),
		type: "POST",
		processData: false,
		contentType: false,
		success: function(response){
			if(response == "1"){
				cancelEdit();
				fetchDevices();
				showControlDevices();
				alert("Edición completa");
			}
		}
	})
});

//Cancelar Edicion
function cancelEdit(){
	$("#id").html("");
	$(".form-edit").html("");
	$(".edit-control").html("");
	$("#form-edit-image").hide();
	$(".card-img-top").attr("src", "img/noImage.png");

	$.get(dir + "delete-edit-image.php", function(){});
}