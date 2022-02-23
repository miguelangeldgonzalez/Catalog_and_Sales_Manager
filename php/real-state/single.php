<?php 
include '../db.php';

$id = $_POST['id'];

$result = query('real_state', "`id` = '$id'");

$user = query("users", "`id` = '". $result[0]['adviser']."'");
$user_fullname = $user[0]['nombres'] . " " . $user[0]['apellidos'];

$result[0]['adviser'] = $user_fullname;

echo json_encode($result[0]);

?>