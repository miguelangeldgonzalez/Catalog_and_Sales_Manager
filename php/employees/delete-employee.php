<?php

include "../../php/db.php";

$id = $_POST['id'];
$query = "DELETE FROM users WHERE `id` = '$id'";

$result = mysqli_query($link, $query);

if(!$result){
    die("The query was failed ->" . mysqli_error($link));
}else{
    echo true;
}
?>