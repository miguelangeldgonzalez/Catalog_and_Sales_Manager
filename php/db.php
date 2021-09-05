<?php

	$link = mysqli_connect("localhost", "root", "", "acm");
	$formats = array(".jpeg", ".png", ".jpg");

	function query($query){
		$result = mysqli_query($GLOBALS['link'], $query);

		if(!$result){
			die("The query was failed -> ". mysqli_error($GLOBALS['link']));
		}else{
			$json = array();
			while($row = mysqli_fetch_array($result)){
				$json[] = array(
					"id" => $row['id'], 
					"username" => $row['username'],
					"nombres" => $row['nombres'],
					"apellidos" => $row['apellidos'],
					"celular" => $row['celular'],
					"correo" => $row['correo'],
					"cargo" => $row['cargo'],
					"password" => $row['password']
				);
			}
			return $json;
		}
	}

	$link = mysqli_connect("localhost", "root", "", "acm");

	function insert($tabla){
		
		$query = "SHOW COLUMNS FROM `equipos`";
		$result = mysqli_query($GLOBALS['link'], $query);
		
		$insert = "INSERT INTO `equipos` (";
		$fields = "";
		$values = "";
		
		while($fila = mysqli_fetch_assoc($result)){
			$fields .= "`". $fila['Field']."`, ";
		
			if(array_key_exists($fila['Field'], $_POST)){
				$values .= "'". $_POST[$fila['Field']] . "', ";
			}else{
				$values .= "'', ";
			}
		}
		
		$insert .= substr($fields, 0, -2) . ") VALUES (" . substr($values, 0, -2) . ")";
		$result = mysqli_query($GLOBALS['link'], $insert);

		if(!$result){
			die("Failed: " . mysqli_error($GLOBALS['link']));
		}else{
			return true;
		}
	}
 ?>