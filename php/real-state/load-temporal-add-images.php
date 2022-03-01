<?php

include '../db.php';
include '../image-handler.php';

echo json_encode(loadTemporalImage('images', true));

?>