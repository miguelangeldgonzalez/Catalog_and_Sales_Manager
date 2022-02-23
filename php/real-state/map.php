<?php

require "../db.php";

echo json_encode(query("real_state", "`id` = '".$_POST['id']."'", "location")[0]['location']);

?>