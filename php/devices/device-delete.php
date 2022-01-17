<?php

include '../db.php';

$id = $_POST['id'];
$query = "DELETE FROM devices WHERE `id` = '$id'";

$result = mysqli_query($link, $query);

foreach($formats as $f){
    if(file_exists("../../img/phones/".$id.$f)){
        unlink("../../img/phones/".$id.$f);
    }
}


if($result){
    echo true;
}else{
    die("The query was failed ->". mysqli_error($link));
}




?>