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

$result = query("devices", "", $selection);

echo json_encode($result);

?>