<?php 
	session_start(); 
	if(!isset($_SESSION['entries']))
		$_SESSION['entries']=array();
?>
<html>
<head>
	<title>Cory McDonald</title>
	<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
</head>
<body>
	<?php
	 ?>
	<div class="container">
		<form action="<?print($_SERVER['index.php'])?>" method="GET">
			<legend>Form title</legend>
		
			<div class="form-group">
				<label for="">Enter information below</label>
				<input type="text" class="form-control" id="" placeholder="Input field">
			</div>
		
			
		
			<button type="button" class="btn btn-primary">Submit</button>
		</form>
	</div>
	<code>
	<?php print_r($_GET)?><br/>
	<?php print_r($_SESSION) ?>

	</code>
</body>
</html>