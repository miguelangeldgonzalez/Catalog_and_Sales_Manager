<?php

include '../db.php';

$admin = $_POST['admin'];

if($admin == "true"){
	$query = "SELECT * FROM devices";
}else{
	$query = "SELECT * FROM devices WHERE `disponible` = '1'";
}

$result = mysqli_query($link, $query);

if(!$result){
	die("error".mysqli_error($link));
}

$json = array();
while($row = mysqli_fetch_array($result)){
	$json[] = array("id" => $row['id'], "modelo" => $row['modelo'], 'marca' => $row['marca'], 'precio' => $row['precio'], "RAM" => $row['RAM'], "almacenamiento" => $row['almacenamiento'], 'camara' => $row['camara'], 'procesador' => $row['procesador'], 'SO' => $row['SO'], "disponible" => $row['disponible']);
}

$jsonstring = json_encode($json);

echo $jsonstring;

?>