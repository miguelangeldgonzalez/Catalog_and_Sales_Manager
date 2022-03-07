<?php
define('ROOT_PATH', realpath(dirname(__FILE__)));
unlink(ROOT_PATH."\..\..\img\\tmpImageMultiple_".$_POST['source']);
?>