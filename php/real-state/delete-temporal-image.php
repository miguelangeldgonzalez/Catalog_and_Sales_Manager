<?php
define('ROOT_PATH', realpath(dirname(__FILE__)));
unlink(ROOT_PATH."\..\..\\".$_POST['source']);
?>