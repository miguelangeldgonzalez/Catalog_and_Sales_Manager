$(document).ready(function(){
	var dir = "php/home/";

	var userData = {};

	$.ajax({
		method: 'GET',
		url: "php/session.php",
		success: function(response){
			console.log(response);
			if(response != 0){
				userData = JSON.parse(response)[0];

				$("#tittleImage").attr("src", "img/usersPhotos/" + userData.username + "." + userData.foto);
				
				$("#name").html(userData.nombres + " " + userData.apellidos);
				$("#type").html(userData.type);
			}else{
				window.location = "index.html";
			}
		}
	});

	$("#cerrar").on("click", function(){
		$.ajax({
			method: 'GET',
			url: 'php/close.php',
			success: function(){
				window.location = "index.html";
			}
		});
	});

	$(".btn-primary").on("click", function(){
		let panel = "";

		switch($(this).html()){
			case "Registrar":
				panel = "personal";
				break;
			case "Crear Código":
				panel = "code";
				break;
			case "Crear Sección":
				panel = "section";
				break;
			case "Administrar Pensum":
				panel = "pensum";
				break;
		}

		$.get("panels/coordinadores/" + panel + ".html", function(response){
			$("#panel").html(response);
		});
		$("#panel").trigger("focus");
	});

});