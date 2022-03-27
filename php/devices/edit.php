<?php

include "../db.php";
define('ROOT_PATH', realpath(dirname(__FILE__)));

if(array_key_exists("image", $_POST)){
	rename(ROOT_PATH."\..\..\\img\\tmpImage_0_".$_POST['image'], ROOT_PATH."\..\..\\img\\phones\\".$_POST['id'].$_POST['image']);
}

$camara = array( 'front' => $_POST['camara_frontal'], 'back' => $_POST['camara_trasera']);
$_POST['camara'] = json_encode($camara);

$procesador = array('name' => $_POST['nombre_procesador'], 'GHZ' => $_POST['capacidad_procesador']);
$_POST['procesador'] = json_encode($procesador);

if(update("devices")){
    $_POST['success'] = true;

    echo json_encode($_POST);
}


?>