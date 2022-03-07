<?php

include '../db.php';
include '../image-handler.php';

define('REAL_STATE_PATH', ROOT_PATH."\..\img\\real-state-photos\\");

date_default_timezone_set("America/Caracas");
$date = date('Y-m-d_H-i-s', time());
$_POST['id'] = "R-$date";

mkdir(REAL_STATE_PATH.$_POST['id'], 0777, true);

$images = json_decode($_POST['images']);

foreach($images as $key => $image){
    $dir = REAL_STATE_PATH.$_POST['id']."\\".$key."\\";
    mkdir($dir);

    for($i = 0; $i < count($image); $i++){
        $image_name = "tmpImageMultiple_".$image[$i]->id."_".$image[$i]->type;
        
        rename(ROOT_PATH."\..\img\\".$image_name, ROOT_PATH."\..\img\\real-state-photos\\".$_POST['id']."\\".$key."\\".$i."_".$image[$i]->type);
    }
}

insert("real_state");

$result = query("users", "`id` = '".$_POST['adviser']."'");
$_POST['adviser'] = $result[0]['nombres']." ".$result[0]['apellidos'];

echo json_encode($_POST);

?>