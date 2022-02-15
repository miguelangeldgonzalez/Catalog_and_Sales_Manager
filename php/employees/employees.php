<?php

include '../../php/db.php';

$jsonstring = json_encode(query("users"));

echo $jsonstring;

?>