<?php
include '../db.php';

$id = $_POST['id'];
$table = explode("-", $id);
$table = $table[0];

if($table == 'R'){
    $table = "real_state_sells";
}
if($table == 'S'){
    $table = "devices_sales";
}

$query = "DELETE FROM `$table` WHERE `id` = '$id'";

$result = mysqli_query($link, $query);


?>