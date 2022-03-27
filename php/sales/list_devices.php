<?php

include '../db.php';

$result = query("devices_sales");

//Change the id of the adviser for the name of the adviser
for($i = 0; $i < count($result); $i++){
    $user = query("users", "`id` = '". $result[$i]['adviser']."'");
    $user_fullname = $user[0]['nombres'] . " " . $user[0]['apellidos'];

    $result[$i]['adviser'] = $user_fullname;

    $device = query("devices", "`id` = '". $result[$i]['device']."'");

    if(count($device) < 1){
        $device = query("no_stock_devices", "`id` = '". $result[$i]['device']."'");
        $device_description = $device[0]['description'];
    }else{
        $device_description = $device[0]['marca'] . " " . $device[0]['modelo'];
    }

    $result[$i]['device'] = $device_description;
}

echo json_encode($result);

?>