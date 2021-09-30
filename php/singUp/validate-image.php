<?php

include '../devices/delete-edit-image.php';

if($_FILES['image']['size'] > 3000000000){
	echo 1;
}elseif($_FILES['image']['type'] == "image/jpeg" || $_FILES['image']['type'] == "image/png" || $_FILES['image']['type'] == ""){
		
    $format = substr($_FILES['image']['type'], 6);
    move_uploaded_file($_FILES['image']['tmp_name'], "../../img/tmpImage.".$format);

    echo $format;
}else{
	echo 2;
}


?>