<?php 
	include 'db.php';
	
	session_start();
	if(!empty($_SESSION['username'])){
		$username = $_SESSION['username'];
		
		$query = "SELECT * FROM usuarios WHERE username = '$username'";

		$result = query($query);
		$jsonstring = json_encode($result);
		echo $jsonstring;
	}else{
		echo 0;
		session_destroy();
	}


 ?>