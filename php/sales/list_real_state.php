<?php

include '../db.php';

$result = query("real_state_sells");

//Change the id of the adviser for the name of the adviser
for($i = 0; $i < count($result); $i++){
    $user = query("users", "`id` = '". $result[$i]['sell_adviser']."'");
    $user_fullname = $user[0]['nombres'] . " " . $user[0]['apellidos'];

    $result[$i]['sell_adviser'] = $user_fullname;

    $user = query("users", "`id` = '". $result[$i]['catchment_adviser']."'");
    $user_fullname = $user[0]['nombres'] . " " . $user[0]['apellidos'];

    $result[$i]['catchment_adviser'] = $user_fullname;
}

echo json_encode($result);

?>