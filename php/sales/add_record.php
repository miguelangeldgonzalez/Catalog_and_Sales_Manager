<?php
include '../db.php';
if($_POST['table'] == 'R'){
    define('ROOT_PATH', realpath(dirname(__FILE__)));

    $id = $_POST['id'];
    $query = "DELETE FROM `real_state` WHERE `id` = '$id'";

    $result = mysqli_query($link, $query);

    $path = ROOT_PATH."\..\..\img\\real-state-photos\\".$id;

    if(file_exists($path)){
        array_map('unlink', glob($path."\\*"));
        rmdir($path);
    }

    if(insert("real_state_sells")){
        $_POST['success'] = true;

        $user = query("users", "`id` = '". $_POST['catchment_adviser']."'");
        $user_fullname = $user[0]['nombres'] . " " . $user[0]['apellidos'];
    
        $_POST['catchment_adviser'] = $user_fullname;

        $user = query("users", "`id` = '". $_POST['sell_adviser']."'");
        $user_fullname = $user[0]['nombres'] . " " . $user[0]['apellidos'];
    
        $_POST['sell_adviser'] = $user_fullname;
    }else{
        $_POST['success'] = false;
    }
}else{
    if($_POST['table'] == 'D'){
        date_default_timezone_set("America/Caracas");
        $date = date('Y-m-d_H-i-s', time());
        $_POST['id'] = "S-$date";
        
        if(insert("devices_sales")){
            $_POST['success'] = true;
    
            $user = query("users", "`id` = '". $_POST['adviser']."'");
            $user_fullname = $user[0]['nombres'] . " " . $user[0]['apellidos'];
    
            $_POST['adviser'] = $user_fullname;
    
            $user = query("devices", "`id` = '". $_POST['device']."'");
            $user_fullname = $user[0]['marca'] . " " . $user[0]['modelo'];
    
            $_POST['device'] = $user_fullname;
        }else{
            $_POST['success'] = false;
        }
    }else{
        $_POST['success'] = false;
    }
}


print_r(json_encode($_POST));

?>