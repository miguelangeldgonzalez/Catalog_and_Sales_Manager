<?php

include '../db.php';

if($_FILES['foto']['size'] > 3000000000){
    echo "1";
}elseif($_FILES['foto']['type'] == "image/jpeg" || $_FILES['foto']['type'] == "image/png" || $_FILES['foto']['type'] == ""){
	if(isset($_POST['modelo'])){
		
		$camara = array( 'front' => $_POST['camaraFrontal'], 'back' => $_POST['camaraTrasera']);
		$_POST['camara'] = json_encode($camara);

		$procesador = array('name' => $_POST['procesadorNombre'], 'GHZ' => $_POST['procesadorGHZ']);
		$_POST['procesador'] = json_encode($procesador);
		
		$_POST['id'] = $_POST['modelo']."-".$_POST['almacenamiento']."-".$_POST['precio'];
		$_POST['disponible'] = 1;
		
		if($_FILES['foto']['type'] == ""){
			$format = substr($_FILES['foto']['type'], 6);
			move_uploaded_file($_FILES['foto']['tmp_name'], '../../img/phones/'.$_POST['id'].".".$format);
		}

		$result = insert("equipos");
		
		if($result){
			echo "3";
		}
	}
}else{
    echo "2";
}


?>