<?php

include '../db.php';

$result = query("devices");

echo json_encode($result);

?>