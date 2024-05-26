let Profile = document.getElementById("profile-pic");
let file = document.getElementById("input-file");
let popup = document.getElementById("pop-up");
let tombol = document.getElementById("logout");
let Oke = document.getElementById("Ok");

file.onchange = function () {
  Profile.src = URL.createObjectURL(file.files[0]);
  uploadProfilePic(file.files[0]);
};

async function uploadProfilePic(file) {
  const userId = sessionStorage.getItem('id');
  const formData = new FormData();
  formData.append('profilePic', file);
  formData.append('userId', userId);

  try {
      const response = await fetch('/upload-profile-pic', {
          method: 'POST',
          body: formData
      });
      const data = await response.json();
      console.log('Upload response:', data);
      Swal.fire({
        title: "Profile picture uploaded successfully!",
        icon: "success",
        showConfirmButton: false,
        timer: 800
      });
  } catch (error) {
      console.error('Error uploading profile picture:', error);
      Swal.fire({
        title: "Error uploading profile picture!",
        icon: "error",
        showConfirmButton: false,
        timer: 800
      });
  }
}



tombol.addEventListener("click", (event) => {
  event.preventDefault();
  openpopup();
});


window.onload = async function() {
  // Retrieve the user's name from sessionStorage
  const userName = sessionStorage.getItem('name');
  const userId = sessionStorage.getItem('id');
  console.log(userId);
  
  // If the user's name is available
  if (userName) {
      try {
          // Send a request to the server to fetch user data based on the name
          const response = await fetch(`/user/${userName}`);
          const userData = await response.json();
          
          // Populate the input fields with the user's data
          document.getElementById("name").value = userData.name;
          document.getElementById("email").value = userData.email;
          document.getElementById("phonenumber").value = userData.phone;
          
          // Set gender select option
          if (userData.gender) {
            document.getElementById("gender").value = userData.gender;
         }
          
          // Set date input value
          if (userData.dob) {
              const dob = new Date(userData.dob); // Assuming dob is stored as a string in 'YYYY-MM-DD' format
              const formattedDate = dob.toISOString().split('T')[0];
              document.getElementById("date").value = formattedDate;
          }

          if (userData.profile_pic_path) {
            const profilePicURL = `/uploads/${userData.profile_pic_path}`;
            document.getElementById("profile-pic").src = profilePicURL;
          }

          if(userData.status == 1){
            document.querySelector('.Edit').style.display = 'none';
          }else if(userData.status == 2 || userData.status == 3){
            document.querySelector('.Vet').style.display = 'none';
            document.querySelector('.Groom').style.display = 'none';
            document.querySelector('.Edit').style.display = 'block';
          }
      } catch (error) {
          console.error('Error fetching user data:', error);
      }
  }
}

document.querySelector('.Save').addEventListener('click', async (event) => {
  event.preventDefault();

  // Gather updated user information from input fields
  const id = sessionStorage.getItem('id');
  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;
  const gender = document.getElementById("gender").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phonenumber").value;

  sessionStorage.name = name;
  sessionStorage.email = email;

  // Send a POST request to update user information
  try {
      const response = await fetch('/update-user', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              id: id,
              email: email,
              name: name,
              dob: date,
              gender: gender,
              phone: phone
          })
      });
      const data = await response.json();
      console.log(data); // Log response from server
      // Optionally, display a message indicating success
      Swal.fire({
        title: "User information updated successfully!",
        icon: "success"
      });
  } catch (error) {
      console.error('Error updating user information:', error);
      // Handle error (e.g., display an error message)
      Swal.fire({
        title: "Error updating user information. Please try again.",
        icon: "error"
      });
  }

});


function openpopup() {
  popup.classList.add("open-popup");
  Oke.addEventListener("click", closepopup);
}

function closepopup() {
  popup.classList.remove("open-popup");
  Oke.addEventListener("click", closepopup);
  sessionStorage.clear();
  setTimeout(() => {
    window.location.href = "/login";
  }, 500);
}

function validationform() {
  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;
  const gender = document.getElementById("gender").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phonenumber").value;
  const password = document.getElementById("pass").value;
  const conpassword = document.getElementById("conpass").value;
  if (name == "" || date == "" || phone == "") {
    alert("A")
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