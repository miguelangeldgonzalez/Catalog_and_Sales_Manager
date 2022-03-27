<?php
include '../db.php';

print_r(query("devices", "`id` ='".$_POST['id']."'", 'disponible')[0]['disponible']);

?>