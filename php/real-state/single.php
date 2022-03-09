<?php 
include '../db.php';

define('ROOT_PATH', realpath(dirname(__FILE__)));

$id = $_POST['id'];

$result = query('real_state', "`id` = '$id'");
$result[0]['adviser_id'] = $result[0]['adviser'];

$user = query("users", "`id` = '". $result[0]['adviser']."'");
$user_fullname = $user[0]['nombres'] . " " . $user[0]['apellidos'];

$result[0]['adviser'] = $user_fullname;

if(file_exists(ROOT_PATH."\..\..\img\\real-state-photos\\$id\\")){
    $result[0]['foto'] = array_diff(scandir(ROOT_PATH."\..\..\img\\real-state-photos\\$id\\"), [".", ".."]);
}else{
    $result[0]['foto'] = null;
}

echo json_encode($result[0]);

?>