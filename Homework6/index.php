<?php
	session_start();
	if (!isset($_SESSION['entries'])) $_SESSION['entries'] = array();
	{
		$entries = & $_SESSION['entries'];
	}
	if (isset($_GET['submit']))
	{ 
		$_SESSION['entries'][] = "<h3>" . htmlentities($_GET['title']) . "</h3><small><i>"  . date("Y M D h:i") . "</i></small><br/><p>" . htmlentities($_GET['entry']) . "</p></br>";
	}
	if ($_SERVER['REQUEST_METHOD'] == 'DELETE' || ($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST['_METHOD'] == 'DELETE'))
	{
		$_SESSION['entries'] = array();
	}
?>
<html>
<head>
	<title>Cory McDonald</title>
	<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
</head>
<body>


	<div class="container">

		<form action="<?php print ($_SERVER['SCRIPT_NAME']) ?>" method="GET">
			<legend>Dairy</legend>
			<div class="form-group">
				<input type="text" class="form-control" id="" name='title' placeholder="Title" autofocus>
				<textarea  type="text" class="form-control" id="" name='entry' placeholder="Body"  style="height:150px;"></textarea>
			</div>		
			<button type="submit" name="submit" class="btn btn-primary">Submit</button>
		</form>
		<form action="<?php print ($_SERVER['SCRIPT_NAME']) ?>" method="post" onsubmit="return confirm('Are you sure you want to clear everything?')  ">
		    <input type="hidden" name="_METHOD" value="DELETE">
			<button type="submit" name="clearButton" class="btn btn-warning">
			Clear all entries
			</button>
		</form>
		<?php
			for ($x=count($entries)-1; $x>=0; $x--)
			{
				 echo "$entries[$x]";
			}
		?>
	</div>

	<code>

	</code>
</body>
</html>