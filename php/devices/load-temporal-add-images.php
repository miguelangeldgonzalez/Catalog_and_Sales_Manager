<?php

include '../db.php';
include '../image-handler.php';

$last = $_POST['last'];

if($last != 'undefined'){
    $last = intval($last);
}else{
    $last = 0;
}
echo json_encode(loadTemporalImage('images'));

?>