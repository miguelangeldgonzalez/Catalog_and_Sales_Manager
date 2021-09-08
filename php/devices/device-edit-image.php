<?php

include '../db.php';

$image = $_FILES['edit-image']['name'];
$format = $_FILES['edit-image']['type'];

foreach($formats as $f){
    if(file_exists("../../img/tmpImage".$f)){
        unlink("../../img/tmpImage".$f);
    }
}

if($format == "image/jpeg" or $format == "image/png"){

    if($_FILES['edit-image']['size'] <= 3000000){
        if($format == "image/jpeg"){
            $format = ".jpg";
        }else{
            $format = ".png";
        }

        move_uploaded_file($_FILES['edit-image']['tmp_name'], "../../img/tmpImage".$format);

        echo $format;
    }else{
        echo 2;
    }
}else{
    echo 1;
}

?>