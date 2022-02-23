<?php

include '../db.php';

//Get the fields to fill the table
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

$result = query("real_state", "", $selection);

//Change the id of the adviser for the name of the adviser
for($i = 0; $i < count($result); $i++){
    $user = query("users", "`id` = '". $result[$i]['adviser']."'");
    $user_fullname = $user[0]['nombres'] . " " . $user[0]['apellidos'];

    $result[$i]['adviser'] = $user_fullname;
}

echo json_encode($result);

?>