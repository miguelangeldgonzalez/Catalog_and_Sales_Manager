<?php 
include '../db.php';

$id = $_POST['id'];
$query = "SELECT * FROM equipos WHERE id = '$id'";
$result = mysqli_query($link, $query);

if(!$result){
	die("error ->".mysqli_error($link));
}

$json = array();
while($row = mysqli_fetch_array($result)){
	$json[] = array('marca' => $row['marca'], "modelo" => $row['modelo'], 'precio' => $row['precio'], "almacenamiento" => $row['almacenamiento'], "RAM" => $row['RAM'], 'SO' => $row['SO'], 'camara' => $row['camara'], 'procesador' => $row['procesador'], "id" => $row['id'], "disponible" => $row['disponible']);
}

foreach($formats as $f){
	if(file_exists("../../img/phones/".$json[0]['id'].$f)){
		$json[0]['foto'] = $f;
	}
}
$jsonstring = json_encode($json);

echo $jsonstring;


 ?>