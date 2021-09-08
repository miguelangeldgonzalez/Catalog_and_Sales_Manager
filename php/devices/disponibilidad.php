<?php

include "../db.php";

$id = $_POST['id'];
$d = $_POST['d'];

if($d){
    $d = 1;
}else{
    $d = 0;
}

$query = "UPDATE `equipos` SET `disponible`='$d' WHERE `id` = '$id'";

$result = mysqli_query($link, $query);

if(!$result){
    die("The query was failed ->" . mysqli_error($link));
}else{
    echo true;
}


?>