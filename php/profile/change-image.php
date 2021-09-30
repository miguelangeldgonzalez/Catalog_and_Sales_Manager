<?php

include '../db.php';

if($_FILES['image']['size'] > 3000000000){
	echo 1;
}elseif($_FILES['image']['type'] == "image/jpeg" || $_FILES['image']['type'] == "image/png" || $_FILES['image']['type'] == ""){
		
    $format = ".".substr($_FILES['image']['type'], 6);

    session_start();
    $path = "../../img/profiles-photos/";
    foreach($formats as $f){
        if(file_exists($path.$_SESSION['username'].$f)){
            unlink($path.$_SESSION['username'].$f);
        }
    }

    move_uploaded_file($_FILES['image']['tmp_name'], $path.$_SESSION['username'].$format);

    $query = "UPDATE `usuarios` SET `foto` = '".$format."' WHERE `username` = '".$_SESSION['username']."'";
    
    mysqli_query($link, $query);

    echo $format;
}else{
	echo 2;
}


?>