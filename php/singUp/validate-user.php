<?php

include "../db.php";

$username = $_POST['username'];

$query = "username = '$username'";

$result = query("users", $query);
$length = sizeof($result);

if($length >= 1){
    echo true;
}else{
    echo false;
}


?>