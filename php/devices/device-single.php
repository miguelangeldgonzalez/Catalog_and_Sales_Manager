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

echo json_encode($row);

?>