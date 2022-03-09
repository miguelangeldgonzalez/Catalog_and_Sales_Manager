<?php

include '../db.php';

$_POST['fields'] .= ',id';
$fields = explode(',', $_POST['fields']);

$selection = "";

for($i = 0; $i < count($fields); $i++){
    if((count($fields) - 1) != $i){
        $selection .= "`".$fields[$i]."`, ";
    }else{
        $selection .= "`".$fields[$i]."`";

    }
}

session_start();

$cargo = query("users", "`username` = '".$_SESSION['username']."'", "cargo")[0]['cargo'];

$condition  = "";

if($cargo == "Asesor"){
    $condition = "`disponible` = '1'";
}

$result = query("devices", $condition);

echo json_encode($result);


?>