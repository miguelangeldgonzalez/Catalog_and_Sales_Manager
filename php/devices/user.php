<?php

include "../db.php";

session_start();

if(!empty($_SESSION['username'])){
    $username = $_SESSION['username'];
    $query = "SELECT * FROM usuarios WHERE username = '$username'";

    $json = query($query);
    $out = json_encode($json);

    echo $out;
}

?>