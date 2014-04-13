
function httpPost(url, payload, callback) {
  var request = new XMLHttpRequest();


  request.onreadystatechange = function() {
    if(request.readyState == 4) {
      if(request.status == 200)
        callback(request.responseText);
      else
      {
        if(request.status === 0 && request.statusText.length === 0) //Gotta do a type comparision!
          // console.log("Request blocked by same-origin policy")
          console.log("no data")
        else
          alert("Server returned status " + request.status +
            ", " + request.statusText);
      }
    }
  }
  request.open('POST', url, true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(payload);
}
var ArrayOfJson = "";
function callback (storeText) {
  
  // console.log(storeText)
  ArrayOfJson = JSON.parse(storeText);
  document.getElementById('fileSelect').innerHTML = "";
  document.getElementById('dirSelect').innerHTML = "";
  var directory = ArrayOfJson["dir"];
  
  dirSelect.innerHTML = "";
  var diroption = document.createElement("option");
  diroption.text = "..";
  diroption.value = "..";
  dirSelect.add(diroption);
  
  var directory = ArrayOfJson["dir"];

  for(var i=0; i<ArrayOfJson["files"].length; i++)
  {
    
      if(ArrayOfJson["files"][i].replace("../", "").indexOf('.') !== -1 )
      {
        var fileSelect = document.getElementById("fileSelect");
        var option = document.createElement("option");
        option.text = ArrayOfJson["files"][i];
        fileSelect.add(option);
      }else
      {
        var diroption = document.createElement("option");
        diroption.text = ArrayOfJson["files"][i];
        dirSelect.add(diroption);
      }
  }
}
function clickDirectory(directory)
{
  httpPost('filesystem.php', directory, callback);
}
function validateForm()
{
  var password1=document.forms["signup"]["password"].value;
  var password2=document.forms["signup"]["password2"].value;
  var returnValue = true;
  var d = document.getElementById("signup");
  //Gotta do type comparisions because of dynamic typed languages.
  if (password1===null || password1==="" || password2 ===null || password2==="")
  {
    d.className = d.className + " has-error";
    alert('Please enter a password');
    returnValue = false;
  }
  else if(password1 !== password2)
  {
    d.className = d.className + " has-error";
    alert('Password 1 does not match Password 2');
    returnValue = false;
  }
  return returnValue;
}