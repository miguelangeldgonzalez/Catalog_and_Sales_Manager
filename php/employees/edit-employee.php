<?php

include '../../php/db.php';

$id = $_POST['id'];
$cargo = $_POST['cargo'];

$query = "UPDATE `users` SET `cargo`='$cargo' WHERE `id` = '$id'";

$result = mysqli_query($link, $query);

if(!$result){
    die("The query was failed -> " . mysqli_error($link));
}else{
    echo true;
}


?>