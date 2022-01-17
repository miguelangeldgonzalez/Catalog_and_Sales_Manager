<?php

include '../db.php';

$update = "UPDATE `users` SET ";

//Rellenar la consulta
foreach($_POST as $key => $value){
    if($value != "" && $key != "image"){
        $update .= "`".$key."` = '".$value."', ";
    }
}

$update = substr($update, 0, -2);

//Colocar el WHERE
session_start();
$update .= " WHERE `username` = '". $_SESSION['username'] . "'";

if($_SESSION['username'] != $_POST['username']){
    
    $path = "../../img/profiles-photos/";

    foreach($formats as $f){
        if(file_exists($path.$_SESSION['username'].$f)){
            rename($path.$_SESSION['username'].$f, $path.$_POST['username'].$f);
        }
    }

    $_SESSION['username'] = $_POST['username'];
}

$result = mysqli_query($link, $update);

if($result){
    echo "true";
}else{
    echo "false";
}
?>