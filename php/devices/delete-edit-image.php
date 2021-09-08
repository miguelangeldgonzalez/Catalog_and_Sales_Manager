<?php

if(file_exists("../../img/tmpImage.jpg")){
    unlink("../../img/tmpImage.jpg");
}elseif(file_exists("../../img/tmpImage.png")){
    unlink("../../img/tmpImage.png");
}

?>