<?php
session_start();
if (isset($_SESSION['username']))
{
	$username = $_SESSION['username'];
	$email =  $_SESSION['email'] ;

}else
{
	header('Location: index.php');
}

?>

<!DOCTYPE html>
<html>
<head>
	<title>Homework 8</title>
	<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
	<script src="home.js"></script>
</head>
<body>
	<div class="container">
			 <img src="ajax.png" alt="ajax!" class="img-thumbnail">
		
			<input type="button" class="btn btn-primary" onclick="httpPost('filesystem.php', null, callback);" value="Populate File Directory"><br/>
			<select size="15" id="dirSelect" onChange="clickDirectory(this.options[this.selectedIndex].value)">

			</select>
			<select size="15" id="fileSelect">
			
			</select>
	</div>
</body>
</html>