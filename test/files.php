<?php

function read_all_files($root = '.'){
    $files = [];

    $actual_dir = array_diff(scandir($root), [".", ".."]);

    for($i = 2; $i < count($actual_dir); $i++){
        $actual_dir_path = $root ."/". $actual_dir[$i];
        print_r($scandir($root));

        if(is_dir($actual_dir_path)){
            $content = read_all_files($actual_dir_path);
            $files[$actual_dir[$i]] = $content;
        }else{
            array_push($files, $actual_dir_path);
        }
    }

    return $files;
}
//$files = read_all_files("./../php");
$files = read_all_files("./../img/real-state-photos/R-2022-03-06_04-11-19/front");
print_r($files);

?>