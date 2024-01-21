let upload = document.getElementById("imageFileInput");
let uploadLable = document.getElementById("lable");

let img = document.querySelector("img");


upload.onchange = function () {
    let file = new FileReader();
    file.readAsDataURL(upload.files[0]);
    file.onload = function(){
        img.src = file.result;
    }
    img.onload = function(){
        img.width = img.width;
        img.height = img.height;
        uploadLable.style.display='none';
    }
    
}

function registration() {
  let request = new XMLHttpRequest();

  request.open("POST", "http://localhost:3000/register");
  request.responseType = "json";
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader("Content-type", "application/json");

  // Create an object with the registration data
  let registrationData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    phone: document.getElementById("phone").value,
    dateOfBirth: document.getElementById("dateOfBirth").value,
  };

  // Convert the object to a JSON string
  let bodyParams = JSON.stringify(registrationData);

  request.send(bodyParams);

  request.onload = function () {
    if (request.status >= 200 && request.status < 300) {
      let response = request.response;
      console.log(response);
      console.log("Status code: " + request.status);
      console.log("Post done");
    } else {
      console.error("Error with status code: " + request.status);
    }
  };
}

// Attach the registration function to the button click event
document.getElementById("registrationButton").addEventListener("click", registration);
