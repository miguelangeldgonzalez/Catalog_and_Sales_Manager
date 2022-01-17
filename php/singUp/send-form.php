<?php
    include "../db.php";

    foreach($formats as $f){
        if(file_exists("../../img/tmpImage".$f)){
            rename("../../img/tmpImage".$f, "../../img/profiles-photos/".$_POST['username'].$f);
            $_POST['foto'] = $f;
        }
    }

    $_POST['cargo'] = "Asesor";
    $_POST['password'] = password_hash($_POST['password'], PASSWORD_DEFAULT);
    
    $result = insert('users');

    if($result){
        echo "true";
    }

    session_start();

    $_SESSION['username'] = $_POST['username']; 
?>