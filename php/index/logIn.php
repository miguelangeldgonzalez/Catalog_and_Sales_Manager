<?php 

	include '../db.php';
		
	$username = $_POST['username'];
	$password = $_POST['password'];

	$query = "username = '$username'";
	$result = query("users", $query);

	if(!empty($result)){
		if(password_verify($password, $result[0]['password'])){
			session_start();
			$_SESSION['username'] = $username;
			echo true;
		}
	}else{
		echo false;
	}

 ?>