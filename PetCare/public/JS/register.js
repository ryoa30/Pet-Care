let popup = document.getElementById("pop-up");
let cross = document.getElementById("pop-up-cross");
let popemail = document.getElementById("pop-up-email");
let poppassword = document.getElementById("pop-up-password");
let popconpassword = document.getElementById("pop-up-conpassword");

window.onload = () =>{
  if(sessionStorage.name){
      location.href = '/homepage';
  }
}

document.getElementById("registform").addEventListener("submit", (event) => {
  event.preventDefault();
  const name1 = document.getElementById("name").value;
  const date1 = document.getElementById("date").value;
  const gender1 = document.getElementById("gender").value;
  const email1 = document.getElementById("email").value;
  const phone1 = document.getElementById("phonenumber").value;
  const password1 = document.getElementById("pass").value;
  let isVALID = validationform();
  // console.log(gender1);
  if (isVALID) {
    fetch("/register-user", {
      method: "post",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        name: name1,
        date: date1,
        gender: gender1,
        phone: phone1,
        email: email1,
        password: password1,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.name) {
          openpopup();
          setTimeout(() => {
            closepopup();
            window.location.href = "/login";
          }, 500);
        } else {
          alert(data);
        }
      });
    
  }
});

function validationform() {
  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;
  const gender = document.getElementById("gender").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phonenumber").value;
  const password = document.getElementById("pass").value;
  const conpassword = document.getElementById("conpass").value;
  if (name == "" || date == "" || phone == "") {
    openpopupcross();
    return false;
  } else if (gender == "empty") {
    openpopupcross();
    return false;
  } else if (!email.endsWith("@gmail.com")) {
    openemailpop();
    return false;
  }
  if (password.length < 8 || !/[A-Z]/.test(password[0])) {
    openpasspop();
    return false;
  }
  if (password != conpassword) {
    openconpasspop();
    return false;
  }

  return true;
}

function openpopup() {
  popup.classList.add("openpopup");
}
function closepopup() {
  popup.classList.remove("openpopup");
}

function openpopupcross() {
  cross.classList.add("openpopup");
}

function closepopupcross() {
  cross.classList.remove("openpopup");
}

function openemailpop() {
  popemail.classList.add("openpopup");
}

function closepopupemail() {
  popemail.classList.remove("openpopup");
}
function openpasspop() {
  poppassword.classList.add("openpopup");
}

function closepopuppass() {
  poppassword.classList.remove("openpopup");
}

function openconpasspop() {
  popconpassword.classList.add("openpopup");
}

function closepopupconpass() {
  popconpassword.classList.remove("openpopup");
}
