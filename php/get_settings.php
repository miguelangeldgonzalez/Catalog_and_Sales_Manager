<?php

include 'db.php';

echo json_encode(query('settings')[0]);

?>