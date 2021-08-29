<?php

include '../db.php';

$foto = $_FILES['foto']['name'];
$format = substr($_FILES['foto']['type'], 6);

if($_FILES['foto']['size'] > 3000000000){
    echo "1";
}elseif($_FILES['foto']['type'] == "image/jpeg" || $_FILES['foto']['type'] == "image/png" || $_FILES['foto']['type'] == null){
	if(isset($_POST['modelo'])){
		$marca =  $_POST['marca'];
		$modelo = $_POST['modelo'];
		$precio =  $_POST['precio'];
		$RAM = $_POST['RAM'];
		$almacenamiento =  $_POST['almacenamiento'];
		$SO = $_POST['SO'];
		$tipo = $_POST['tipo'];
		
		$camara = array( 'front' => $_POST['camaraFrontal'], 'back' => $_POST['camaraTrasera']);
		$camara = json_encode($camara);

		$procesador = array('name' => $_POST['procesadorNombre'], 'GHZ' => $_POST['procesadorGHZ']);
		$procesador = json_encode($procesador);

		$id = $modelo."-".$almacenamiento."-".$precio;

		if($_FILES['foto']['type'] !== null){
			move_uploaded_file($_FILES['foto']['tmp_name'], '../../img/phones/'.$id.".".$format);
		}
	
		$query = "INSERT INTO `equipos`(`id`, `marca`, `modelo`, `precio`, `RAM`, `almacenamiento`, `camara`, `procesador`, `SO`, `tipo`) VALUES ('$id','$marca','$modelo','$precio','$RAM','$almacenamiento','$camara','$procesador','$SO','$tipo')";
		
		$result = mysqli_query($link, $query);
		
		if(!$result){
			die("The query was failed -> ". mysqli_error($link));
		}else{
			echo "3";
		}
	}
}else{
    echo "2";
}


?>