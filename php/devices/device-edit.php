<?php

include "../db.php";

$marca = $_POST['marca'];
$modelo = $_POST['modelo'];
$precio = $_POST['precio'];
$RAM = $_POST['RAM'];
$almacenamiento = $_POST['almacenamiento'];
$camara = "{\"front\":\"".$_POST['camara_frontal']."\",\"back\":\"".$_POST['camara_trasera']."\"}";
$procesador = "{\"name\":\"".$_POST['nombre_procesador']."\",\"GHZ\":\"".$_POST['capacidad_procesador']."\"}";
$SO = $_POST['SO'];
$id = $_POST['id'];
$new_id = $modelo."-".$almacenamiento."-".$precio;

$foto = false;

foreach($formats as $f){
    if(file_exists("../../img/tmpImage".$f)){
        $foto = true;
    }
}

if($foto){
    foreach($formats as $f){
        if(file_exists("../../img/phones/".$id.$f)){
            $exist = true;
            unlink("../../img/phones/".$id.$f);
        }
    }
    
    foreach($formats as $f){
        if(file_exists("../../img/tmpImage".$f)){
            rename("../../img/tmpImage".$f, "../../img/phones/".$new_id.$f);
        }
    }
}


$query = "UPDATE `devices` SET `id`='$new_id', `marca`='$marca',`modelo`='$modelo',`precio`='$precio',`RAM`='$RAM',`almacenamiento`='$almacenamiento',`camara`='$camara',`procesador`='$procesador',`SO`='$SO' WHERE `id` = '$id'";

$result = mysqli_query($link, $query);

if(!$result){
    die("The query was failed -> " . mysqli_error($link));
}else{
    echo true;
}


?>