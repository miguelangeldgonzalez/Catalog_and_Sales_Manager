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

 ?>