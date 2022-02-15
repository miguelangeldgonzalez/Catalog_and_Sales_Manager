<?php
include "../php/db.php";

echo json_encode(query("users"));

?>