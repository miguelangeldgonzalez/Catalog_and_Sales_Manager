<?php

include 'db.php';

$result = query("real_state");

for($i = 0; $i < count($result); $i++){
    $user = query("users", "`id` = '". $result[$i]['adviser']."'");
    $user_fullname = $user[0]['nombres'] . " " . $user[0]['apellidos'];

    $result[$i]['adviser'] = $user_fullname;
}

print_r($result);

?>