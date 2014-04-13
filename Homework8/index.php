<?php

	session_start();
// 	//Loading accounts into an array. The true parameter converts to array so we can merge array during account creation.
	$accounts = json_decode(file_get_contents("accounts.json"),true);


	//Checking if we were given a username and password during signup
	if (isset($_POST["username"]) && isset($_POST["email"]) && isset($_POST["password"]))
	{
		if(isset($accounts))
		{
			if(isset($_POST["signup"]))
			{
				if(array_key_exists($_POST["username"], $accounts))
				{
					echo "<div class='container'><p style='padding:7px;'class='btn-danger lead'>Account already exists</p></div>";
				}
				else
				{
					//Even though it is sent through HTTP we probably don't want to store password in plaintext
					//Try using rainbow tables now ;)
				  $salt = microtime();
					$newaccount = array($_POST["username"] => array("email" => $_POST["email"] , "password" => hash('sha256', $_POST['password'] . $salt), "salt"=> $salt ));
					//Merging the array in order to resave
					$accounts = array_merge($accounts, $newaccount);
				

					//Only open the file if we create a new account
					$fh = fopen("accounts.json", 'w');
					if($fh === false)
						die("Failed to open accounts.json for writing.");
					else
					{
						if($accounts == null)
						{
							$accounts = array();
						}
						fwrite($fh, json_encode($accounts, JSON_FORCE_OBJECT));
						fclose($fh);
					}
				}
			}else if(isset($_POST["login"]))
			{
				if(array_key_exists($_POST["username"], $accounts))
				{
					//Found email address, validate username and password
					$jsonEmail = $accounts[$_POST["username"]]["email"];
					$jsonPassword = $accounts[$_POST["username"]]["password"];
					$jsonSalt = $accounts[$_POST["username"]]["salt"];
					
					//Comparing strings, want to make sure casing on email doesn't matter but casing on password does.
					if(strcasecmp($jsonEmail, $_POST["email"]) == 0 && $jsonPassword == hash('sha256', $_POST['password'] . $jsonSalt))
					{
						$_SESSION["username"] = $_POST["username"];
						$_SESSION["email"] = $_POST["email"];
						//Redirecting...
						header('Location: home.php');
					}
				}
				//This will only print if they are not redirected
				echo "<div class='container'><p style='padding:7px;' class='btn-danger lead'>Incorrect email or password</p></div>";
			}
		}
		
	}

	
?>
<html>
<head>
	<title>Homework 8</title>
	<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
	<script type="text/javascript" src="home.js"></script>
</head>
<body>
<!-- Hope you love ugly HTML...Sorry but this is just what Bootstrap does -->
<div class="container">
	<h3>Sign up</h3>
	<form class="form-horizontal" id="signup" action="<?php $_SERVER['SCRIPT_NAME'] ?>" method="POST" role="form" onsubmit="return validateForm()">
		<div class="form-group">
			<label class="col-sm-2 control-label" for="Username">Username</label>
			<div class="col-sm-10">
				<input required type="text" class="form-control" name="username"  placeholder="Enter username">
			</div>
		</div>
		<div class="form-group">
			<label for="Email" class="col-sm-2 control-label">Email address</label>
			<div class="col-sm-10">
				<input required type="email" class="form-control" name="email"  placeholder="Enter email address">
			</div>
		</div>
		<div class="form-group">
			<label for="Password" class="col-sm-2 control-label">Password</label>
			<div class="col-sm-10">
				<input required type="password" name="password" class="form-control"placeholder="Password">
			</div>
		</div>
		<div class="form-group">
			<label for="Password" class="col-sm-2 control-label">Password</label>
			<div class="col-sm-10">
				<input required type="password" name="password2" class="form-control"placeholder="Re-enter Password">
			</div>
		</div>
		<div class="form-group">
			<div class="col-sm-offset-2 col-sm-10">
				<button type="submit" value="submit" class="btn btn-primary">Sign up</button>
			</div>
		</div>
		<input type="hidden" name="signup">
	</form>
</div>

<div class="container">
	<h3>Login</h3>
	<form class="form-horizontal" action="<?php $_SERVER['SCRIPT_NAME'] ?>" method="POST" role="form">
		<div class="form-group">
			<label class="col-sm-2 control-label" for="Username">Username</label>
			<div class="col-sm-10">
				<input required type="text" class="form-control" name="username"  placeholder="Enter username">
			</div>
		</div>
		<div class="form-group">
			<label for="Email" class="col-sm-2 control-label">Email address</label>
			<div class="col-sm-10">
				<input required type="email" class="form-control" name="email"  placeholder="Enter email address">
			</div>
		</div>
		<div class="form-group">
			<label for="Passowrd" class="col-sm-2 control-label">Password</label>
			<div class="col-sm-10">
				<input required type="password" name="password" class="form-control"placeholder="Password">
			</div>
		</div>
		<div class="form-group">
			<div class="col-sm-offset-2 col-sm-10">
				<button type="submit" value="submit" class="btn btn-default">Log in</button>
			</div>
		</div>
		<input type="hidden" name="login">
	</form>

<?php
	echo "<h4>Accounts</h4>";
	print_r($accounts);
?>

</div>

</body>
</html>
