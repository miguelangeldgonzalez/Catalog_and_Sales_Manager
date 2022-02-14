<?php

    include '../db.php';
		
	$username = $_POST['username'];
	$password = $_POST['password'];

	$query = "username = '$username'";
	$result = query("users", $query);

	if(password_verify($password, $result[0]['password'])){
		$_POST['new-password'] = password_hash($_POST['new-password'], PASSWORD_DEFAULT);
		$query = "UPDATE `users` SET `password` = '".$_POST['new-password']."' WHERE `username` = '".$username."'";
		mysqli_query($link, $query);

		echo 1;
	}else{
        echo 0;
    }


?>