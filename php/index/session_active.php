<?php

include "../db.php";

session_start();
if(!empty($_SESSION['username'])){
    $userType =  $_SESSION['userType'];
    $username = $_SESSION['username'];
    
    $query = "SELECT * FROM $userType WHERE username = '$username'";

    $result = query($query);
    $jsonstring = json_encode($result);
    echo $jsonstring;
}else{
    echo 0;
    session_destroy();
}


?>