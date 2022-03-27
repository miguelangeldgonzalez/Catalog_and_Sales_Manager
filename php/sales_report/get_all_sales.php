<?php

include '../db.php';

$query = "SELECT * FROM `real_state_sells` ORDER BY `date`";
$result = mysqli_query($link, $query);
$real_state = [];

while($row = mysqli_fetch_assoc($result)){
    $values = [];
    foreach($row as $key => $value){
        $values[$key] = $value;
    }
    $real_state[] = $values;
}

$query = "SELECT * FROM `devices_sales` ORDER BY `date`";
$result = mysqli_query($link, $query);
$devices = [];

while($row = mysqli_fetch_assoc($result)){
    $values = [];
    foreach($row as $key => $value){
        $values[$key] = $value;
    }
    $devices[] = $values;
}

$out['real_state'] = $real_state;
$out['devices'] = $devices;

print_r(json_encode($out));

?>