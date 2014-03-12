<?php
if(isset($_POST['dir']) && $_POST['dir'] != "null")
{
	$cur_dir = $_POST['dir'];
}
else
{
	$cur_dir = getcwd();
	// $cur_dir = "";
}

$ob = new stdClass();
$ob->dir = $cur_dir;
$ob->files = glob($cur_dir . "/*");

echo '<table class="table table-hover">
				<tr>
					<th>File</th>
					<th>Type</th> 
					<th>Size</th>
				</tr>';
foreach($ob->files as $f)
{
	if(filetype($f) == "dir")
	{
		echo "<tr>";
		// Stand back! This is awful coding practice!
		echo "<th><a href='javascript:httpPost(\"filesystem.php\",\"" . basename($f) ."\" , callback);''>" . basename($f) . "</a></th>";
		echo "<th>" . filetype($f) . "</th>";
		echo "<th>" . round(filesize($f)/1025, 2) . "kB </th>";
		echo "</tr>";
	}else
	{
		echo "<tr>";
		// Stand back! This is awful coding practice!
		echo "<th><a href='" . $filetype. "'>" . basename($f) . "</a></th>";
		echo "<th>" . filetype($f) . "</th>";
		echo "<th>" . round(filesize($f)/1025, 2) . "kB </th>";
		echo "</tr>";
	}
}
echo '</table>';
?>