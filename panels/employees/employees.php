<?php

include '../../php/db.php';

$query = "SELECT * FROM usuarios";

$result = mysqli_query($link, $query);

if(!$result){
    die("The query was failed ->" . mysqli_error($link));
}

$json = array();

while($row = mysqli_fetch_array($result)){
    $json[] = array("username" => $row['username'], "nombres" => $row['nombres'], "apellidos" => $row['apellidos'], "id" => $row['id'], "celular" => $row['celular'], "cargo" => $row['cargo'],"correo" => $row['correo']);
}

$jsonstring = json_encode($json);

echo $jsonstring;


?>