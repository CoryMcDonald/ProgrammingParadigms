var hello = '';
function httpPost(url, payload, callback) {
  var request = new XMLHttpRequest();


  request.onreadystatechange = function() {
    if(request.readyState == 4) {
      if(request.status == 200)
        callback(request.responseText);
      else
      {
        if(request.status == 0 && request.statusText.length == 0)
          // console.log("Request blocked by same-origin policy")
          console.log("no data")
        else
          alert("Server returned status " + request.status +
            ", " + request.statusText);
      }
    }
  }
  request.open('POST', url, true);
  request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  
  request.send("dir=" + payload); 
}
function callback (storeText) {
  
  document.getElementById('table').innerHTML = storeText;
  // console.log(storeText)
}