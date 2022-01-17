<?php

include "../db.php";

session_start();

$query = "UPDATE `users` SET `foto` = '' WHERE `username` = '".$_SESSION['username']."'";
mysqli_query($link, $query);

$path = "../../img/profiles-photos/";
foreach($formats as $f){
    if(file_exists($path.$_SESSION['username'].$f)){
        unlink($path.$_SESSION['username'].$f);
    }
}

?>