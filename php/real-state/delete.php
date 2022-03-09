<?php

include '../db.php';

define('ROOT_PATH', realpath(dirname(__FILE__)));

$id = $_POST['id'];
$query = "DELETE FROM `real_state` WHERE `id` = '$id'";

$result = mysqli_query($link, $query);

$path = ROOT_PATH."\..\..\img\\real-state-photos\\".$id;

if(file_exists($path)){
    array_map('unlink', glob($path."\\*"));
    rmdir($path);
}

if($result){
    echo true;
}else{
    die("The query was failed ->". mysqli_error($link));
}




?>