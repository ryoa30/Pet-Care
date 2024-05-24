const form = document.querySelector(".Form-Login form");
let popup = document.getElementById("pop-up");
let cross = document.getElementById("pop-up-cross");
let popemail = document.getElementById("pop-up-email");
let poppassword = document.getElementById("pop-up-password");


window.onload = () => {
  if (sessionStorage.name) {
    location.href = "/homepage";
  }
};

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

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = form.querySelector("input[name='email']").value;
  const password = form.querySelector("input[name='password']").value;

  if (!email.endsWith("@gmail.com")) {
    openemailpop();
    return;
  }

  if (password.length < 8 || !/[A-Z]/.test(password[0])) {
    openpasspop();
    return;
  }

  fetch("/login-user", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.name) {
        sessionStorage.name = data.name;
        sessionStorage.email = data.email;
        sessionStorage.id = data.id;
        sessionStorage.status = data.status;
        openpopup();
        setTimeout(() => {
          closepopup();
          window.location.href = "/homepage";
        }, 500);
      } else {
        openpopupcross();
        setTimeout(() => {
          closepopupcross();
        }, 500);
      }
    });
});
