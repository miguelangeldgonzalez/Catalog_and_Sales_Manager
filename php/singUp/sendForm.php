<?php
    include "../db.php";

    $nombres = $_POST['nombres'];
    $apellidos = $_POST['apellidos'];
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $celular = $_POST['celular'];
    $correo = $_POST['correo'];

    $query = "INSERT INTO `usuarios`(`id`, `username`, `nombres`, `apellidos`, `celular`, `cargo`, `correo`, `password`) VALUES (NULL,'$username','$nombres','$apellidos','$celular','Asesor','$correo','$password')";

	$result = mysqli_query($link, $query);
		
	if(!$result){
		die("The query was failed -> ". mysqli_error($link));
	}else{
		echo "true";
	}

    session_start();

    $_SESSION['username'] = $_POST['username']; 
?>