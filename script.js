function myFunction() {
  if (document.forms["myForm"]["name"].value == "" || document.forms["myForm"]["email"].value == "")
  {
    alert("Name and Email required");
  }else{
    document.getElementById("formResponse").innerHTML = "Thank you for subscribing";
    setTimeout(clearFunction, 3000);
  }
  return false
}

function clearFunction(){
    document.getElementById("formResponse").innerHTML = "";
}

