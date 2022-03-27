<?php

include "../db.php";
define('ROOT_PATH', realpath(dirname(__FILE__)));
define('REAL_STATE_PATH', ROOT_PATH."\..\..\img\\real-state-photos\\");

function passImage($image, $path){
    if(count($image) > 0){
        $identifiers = [];
        
        $images_dir = array_diff(scandir($path), [".", ".."]);
        $max = 0;

        if(count($images_dir) > 0){
            for($i = 2; $i < (count($images_dir) + 2); $i++){
                array_push($identifiers, explode("_", $images_dir[$i])[1]);
            }
    
            $max = max($identifiers) + 1;
        }

        for($i = 0; $i < count($image); $i++){
            $format = explode("_", $image[$i])[2];
            $id = intval(explode("_", $image[$i])[1]) + $max;
            rename(ROOT_PATH."\..\..\\".$image[$i], "$path\\image_$id"."_$format");
        }
    }
}

if(array_key_exists("images", $_POST)){
    $_POST['images'] = explode(",", $_POST['images']);
    $path = ROOT_PATH."\..\..\\img\\real-state-photos\\".$_POST['id'];

    if(file_exists($path)){
        passImage($_POST['images'], $path);
    }else{
        mkdir(REAL_STATE_PATH.$_POST['id'], 0777, true);
        passImage($_POST['images'], $path);
    }
}

$ignore = [];

if(array_key_exists("ignore", $_POST)){
    $ignore = $_POST['ignore'];
}

if(update("real_state", [$ignore])){
    $_POST['success'] = true;
    
    $user = query("users", "`id` = '". $_POST['adviser']."'");
    $user_fullname = $user[0]['nombres'] . " " . $user[0]['apellidos'];
    $_POST['adviser'] = $user_fullname;
    
    echo json_encode($_POST);
}else{
    echo "false";
}

?>