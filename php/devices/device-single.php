<?php 
include '../db.php';

$id = $_POST['id'];
$query = "SELECT * FROM devices WHERE id = '$id'";
$result = mysqli_query($link, $query);

if(!$result){
	die("error ->".mysqli_error($link));
}

$row = $result->fetch_array(MYSQLI_ASSOC);

foreach($formats as $f){
	if(file_exists("../../img/phones/".$row['id'].$f)){
		$row['foto'] = $f;
	}
}

$camara = json_decode($row['camara']);
$row['camara_frontal'] = $camara->front;
$row['camara_trasera'] = $camara->back;

unset($row['camara']);

$procesador = json_decode($row['procesador']);
$row['nombre_procesador'] = $procesador->name;
$row['capacidad_procesador'] = $procesador->GHZ;

unset($row['procesador']);

echo json_encode($row);

?>