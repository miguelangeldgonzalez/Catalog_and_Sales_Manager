<?php

	$link = mysqli_connect("localhost", "root", "", "acm");
	$formats = array(".jpeg", ".png", ".jpg");

	function query($table, $condition = "", $selection = "*"){
		if($condition == ""){
			$query = "SELECT ".$selection." FROM ".$table;
		}else{
			$query = "SELECT ".$selection." FROM ".$table." WHERE ".$condition;
		}
	
		$result = mysqli_query($GLOBALS['link'], $query);
		$out = [];
	
		while($row = mysqli_fetch_assoc($result)){
			$values = [];
			foreach($row as $key => $value){
				$values[$key] = $value;
			}
			$out[] = $values;
		}
		
		return $out;
	}

	function insert($tabla){
		
		$query = "SHOW COLUMNS FROM `".$tabla."`";
		$result = mysqli_query($GLOBALS['link'], $query);
		
		$insert = "INSERT INTO `".$tabla."` (";
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