<?php
$ob = new stdClass();
$incoming = file_get_contents('php://input');
if(isset($incoming) && $incoming != null && is_dir($incoming))
{
  $cur_dir = $incoming;
}else
{
  $cur_dir = getcwd();
}

$ob->dir = $cur_dir;
$ob->files = glob($cur_dir . "/*");

header('Content-Type: application/json');
print(json_encode($ob));

?>
