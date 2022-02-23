<?php

include "db.php";

session_start();

if(!empty($_SESSION['username'])){
    $username = $_SESSION['username'];
    $query = "username = '$username'";

    $json = query("users", $query);
    $out = json_encode($json[0]);

    echo $out;
}else{
    session_destroy();
}

?>