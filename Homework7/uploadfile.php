<?php
session_start();
if(isset($_FILES["file"]))
{
	echo "<div class='container'>";
	if ($_FILES["file"]["error"] > 0)
	{
		echo "Error: " . $_FILES["file"]["error"] . "<br>";
	}
	else
	{
		echo "Upload: " . $_FILES["file"]["name"] . "<br>";
		echo "Type: " . $_FILES["file"]["type"] . "<br>";
		echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
		echo "Stored in: " . $_FILES["file"]["tmp_name"];
		if (file_exists($_SESSION['username'] . "/" . $_FILES["file"]["name"]))
		{
			echo "<br/><b>" .  $_FILES["file"]["name"] . " already exists.</b>";
		}
		else 
		{
			if($_FILES["file"]["size"] / 1024 < 1024)
			{
			if(!is_dir($_SESSION['username']))
			{
				$oldmask = umask(0);
				if(!mkdir( $_SESSION['username']))
					die("Error: Failed to make folder.");
				umask($oldmask);
			}
			move_uploaded_file($_FILES["file"]["tmp_name"],
				$_SESSION['username'] . '/' . $_FILES["file"]["name"]);
			echo "Stored in: " .  $_SESSION['username'] . '/'.$_FILES["file"]["name"];
			//Could do some cool ajax to do the file upload async, but since it's not required we're just going to redirect
			header('Location:home.php');
			}else
			{
				echo "<br/><b>Filesize > 1 MB </b>";
			}
		}
	}
	echo "<br/><a href='home.php'>Return?</a>";
	echo "</div>";
}
else
{
	//no files uploaded redirect
	header('Location:home.php');
}
?>
<!DOCTYPE html>
<html>
<head>
	<title>Uploading...</title>
	<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
</head>
<body>

</body>
</html>