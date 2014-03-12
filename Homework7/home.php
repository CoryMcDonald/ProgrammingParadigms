<?php 
session_start();	
if(isset($_POST['deletelist']) )
{
	foreach($_POST['deletelist'] as $DeleteFile) 
	{
		unlink($DeleteFile);
	}
}
if ($_SERVER['REQUEST_METHOD'] == 'DELETE' || ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['_METHOD']) && $_POST['_METHOD'] == 'DELETE'))
{
	// It would be more efficient to put this on the login page, but oh well
	session_destroy();
	//Refreshing current page
	header('Location: '.$_SERVER['REQUEST_URI']);
}

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
	<title>Home | Corybox</title>
	<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
</head>
<body>
	<div class="container">
		<nav class="navbar navbar-default" role="navigation">
			<div class="container-fluid">
				<div class="navbar-header">
					<a class="navbar-brand" href="#">Home</a>
				</div>				
				<form action="<?php print ($_SERVER['SCRIPT_NAME']) ?>" method="post">
					<button type="submit" class="btn btn-default navbar-right navbar-btn">Log out</button>
					<input type="hidden" name="_METHOD" value="DELETE">
				</form>
				<p class="navbar-text navbar-right" style="margin-right:20px;">
					Signed in as 
					<a>
						<?php echo $username?>
					</a>
					| <?php echo $email ?>
				</p>
			</div>
		</nav>
		<form role="form" action="uploadfile.php" method="POST" class="form-inline" enctype="multipart/form-data">
			<legend>Upload a File</legend>
			<div class="form-group">
				<label>File input</label>
				<input type="file" name="file">
				<p class="help-block">Max file size : 1 MB</p>
			</div>
			<button type="submit" class="btn btn-default">Upload</button>
		</form>			

		<form action='<?php $_SERVER['SCRIPT_NAME'] ?>' method='post'>
			<table class="table table-hover">
				<tr>
					<th>File</th>
					<th>Type</th> 
					<th>Size</th>
					<th>Delete</th>
				</tr>

				<?php
				if(is_dir($username))
				{
					$files = scandir($username .'/');
					foreach($files as $file) 
					{
						if(filetype($username . '/' . $file) != 'dir')
						{
							echo "<tr>";
							echo "<th><a href='" .$username . '/' . $file ."'>" . $file . "</a></th>";
							echo "<th>" . filetype($username . '/' . $file) . "</th>";
							echo "<th>" . round(filesize($username . '/' . $file)/1025, 2) . "kB </th>";
							echo "<th> <input type='checkbox' name='deletelist[]' value='". $username . '/' . $file."'></th>";
							echo "</tr>";
						}
					}
				}
				?>
			</table>
			<input type="checkbox" onClick="checkAll(this)" /> Check All | 
			<button type='submit' class='btn btn-default'>Delete files</button></tr>
		</form>
		<script language="JavaScript">
		function checkAll(source) {
		  checkboxes = document.getElementsByName('deletelist[]');
		  for(var i=0, n=checkboxes.length;i<n;i++) {
		    checkboxes[i].checked = source.checked;
		  }
		}
		</script>

	</div>
</body>
</html>