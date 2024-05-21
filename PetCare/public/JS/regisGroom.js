// file.onchange = function() {
    
// }

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
  
            if(userData.status == 1){
              window.URL
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

document.querySelector('.Register').addEventListener('click', async (event) => {
    event.preventDefault();
    if(file.files[0]==null){
        alert("You need to fill the picture");
        return;
    }
    uploadCertificate(file.files[0]);
})

async function uploadCertificate(file) {
    const userId = sessionStorage.getItem('id');
    const formData = new FormData();
    formData.append('certificate', file);
    formData.append('userId', userId);

    try {
        const response = await fetch('/upload-groom-certificate', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        console.log('Upload response:', data);
        alert('Groom certificate uploaded successfully');
        window.location.href = '/Edit';
    } catch (error) {window.location.href = '/Edit';
        console.error('Error uploading certificate:', error);
        alert('Error uploading certificate');
    }
}
