<?php

include '../db.php';
include '../image-handler.php';

define('REAL_STATE_PATH', ROOT_PATH."\..\img\\real-state-photos\\");

date_default_timezone_set("America/Caracas");
$date = date('Y-m-d_H-i-s', time());
$_POST['id'] = "R-$date";

mkdir(REAL_STATE_PATH.$_POST['id'], 0777, true);

$images = json_decode($_POST['images']);

for($i = 0; $i < count($images); $i++){
    $image_name = "tmpImageMultiple_".$images[$i];

    rename(ROOT_PATH."\..\img\\".$image_name, ROOT_PATH."\..\img\\real-state-photos\\".$_POST['id']."\\image_".$images[$i]);
}

insert("real_state");

$result = query("users", "`id` = '".$_POST['adviser']."'");
$_POST['adviser'] = $result[0]['nombres']." ".$result[0]['apellidos'];

echo json_encode($_POST);

?>