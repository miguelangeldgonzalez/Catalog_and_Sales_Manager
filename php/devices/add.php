<?php

include '../db.php';
define('ROOT_PATH', realpath(dirname(__FILE__)));

$camara = array( 'front' => $_POST['camaraFrontal'], 'back' => $_POST['camaraTrasera']);
$_POST['camara'] = json_encode($camara);

$procesador = array('name' => $_POST['procesadorNombre'], 'GHZ' => $_POST['procesadorGHZ']);
$_POST['procesador'] = json_encode($procesador);

date_default_timezone_set("America/Caracas");
$date = date('Y-m-d_H-i-s', time());
$_POST['id'] = "D-$date";
$_POST['disponible'] = 1;


if(array_key_exists('images', $_POST)){
	$_POST['images'] = json_decode($_POST['images'])[0];
	$_POST['images'] = explode("_", $_POST['images'])[1];

	rename(ROOT_PATH."\..\..\\img\\tmpImage_0_".$_POST['images'], ROOT_PATH."\..\..\\img\\phones\\".$_POST['id'].$_POST['images']);
}

$result = insert("devices");

echo json_encode($_POST);


?>