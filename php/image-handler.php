<?php

//If already exist a temporal image delete it
$formats = array(".jpeg", ".png", ".jpg");
define('ROOT_PATH', realpath(dirname(__FILE__)));

function deleteTemporalImage(){
    foreach($GLOBALS['formats'] as $f){
        if(file_exists("../../img/tmpImage".$f)){
            unlink("../../img/tmpImage".$f);
        }
    }
}

function deleteMultipleImage(){
    foreach($GLOBALS['formats'] as $f){
        if(file_exists(ROOT_PATH."\..\img\\tmpImageMultiple0".$f)){
            array_map('unlink', glob(ROOT_PATH."\..\img\\tmpImageMultiple*.*"));
        }
    }
}
//Check if the image is under 3Mb and the type is png or jpg
// 3 if the format isn't correct
// 2 if the size is too big
// 1 if all is correct
function checkImage($type, $size){
    if($type == "image/jpeg" or $type == "image/png"){
        if($size <= 3000000){
            return 1;
        }else{
            return 2;
        }
    }else{
        return 3;
    }
}

function getFormat($format){
    if($format == "image/jpeg"){
        return ".jpg";
    }else{
        return ".png";
    }
}

//Load the image or images
// $filename = the name of the button that has the files
// $multiple = false is there is only one image or false if there are multiple images
function loadTemporalImage($file_name, $multiple = false){
    $file = $_FILES[$file_name];
    $file_data = [];

    if(!$multiple){
        if(checkImage($file['type'], $file['size']) == 1){
            deleteTemporalImage();
            move_uploaded_file($file['tmp_name'], "../img/tmpImage".getFormat($file['type']));
            array_push($file_data, getFormat($file['type']));
        }
    }else{
        deleteMultipleImage();
        for($i = 0; $i < sizeof($file['name']); $i++){
            if(checkImage($file['type'][$i], $file['size'][$i]) == 1){
                move_uploaded_file($file['tmp_name'][$i], ROOT_PATH."\..\img\\tmpImageMultiple".$i.getFormat($file['type'][$i]));
                array_push($file_data, getFormat($file['type'][$i]));
            }
        }
    }

    return $file_data;
}

?>