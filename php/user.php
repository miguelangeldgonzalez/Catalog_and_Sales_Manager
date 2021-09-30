<?php

include "db.php";

session_start();

if(!empty($_SESSION['username'])){
    $username = $_SESSION['username'];
    $query = "username = '$username'";

    $json = query("usuarios", $query);
    $out = json_encode($json);

    echo $out;
}else{
    session_destroy();
}

?>