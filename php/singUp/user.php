<?php

include "../db.php";

$username = $_POST['username'];

$query = "SELECT * FROM usuarios WHERE username = '$username'";

$result = query($query);
$length = sizeof($result);

if($length >= 1){
    echo true;
}else{
    echo false;
}


?>