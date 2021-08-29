<?php
	include '../db.php';

	$search = $_POST['search'];

	if(!empty($search)){
		$query = "SELECT * FROM equipos WHERE marca LIKE '%$search%' or modelo LIKE '%$search%' or precio LIKE '%$search%'";
		$result = mysqli_query($link, $query);
		if(!$result){
			die('Query Error'.mysqli_error($link));
		}

		$json = array();
		while($row = mysqli_fetch_array($result)){
			$json[] = array('id' => $row['id'], 'marca' => $row['marca'], 'modelo' => $row['modelo'], 'precio' => $row['precio']);
		}

		$jsonstring = json_encode($json);
		echo $jsonstring;
	}
?>