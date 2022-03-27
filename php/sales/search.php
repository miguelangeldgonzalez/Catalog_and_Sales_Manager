<?php

include '../db.php';

$table = explode("-", $_POST['search'])[0];
$product = [];

if($table == 'R'){
    $table = "real_state";
    $condition = "`id` = '".$_POST['search']."'";
    
    $product = query($table, $condition);

    if(count($product) > 0){
        $product = $product[0];

        $condition = "`id` = '".$product['adviser']."'";
        $user = query("users", $condition)[0];
    
        $product['adviser_name'] = $user['nombres']. " ". $user['apellidos'];
        $product['success'] = true;
        $product['table'] = "R";

    }else{
        $product['success'] = false;
    }

}
if($table == 'D'){
    $table = "devices";
    $condition = "`id` = '".$_POST['search']."'";
    $product = query($table, $condition);

    if(count($product) > 0){
        $product = $product[0];
        $product['success'] = true;
        $product['table'] = "D";
    }else{
        $product['success'] = false;
    }
}

print_r(json_encode($product));




?> 