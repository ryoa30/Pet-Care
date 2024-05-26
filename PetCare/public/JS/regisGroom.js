window.onload = () => {
    if (sessionStorage.status == 3 || sessionStorage.status == 2) {
      location.href = "/Edit";
    }
  };

document.querySelector('.Register').addEventListener('click', async (event) => {
    event.preventDefault();
    if(file.files[0]==null){
        Swal.fire({
            title: "You need to fill the picture!",
            icon: "error",
            showConfirmButton: false,
            timer: 500
          });
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
        sessionStorage.status = 2;
        const data = await response.json();
        console.log('Upload response:', data);
        Swal.fire({
            title: "Groom certificate uploaded successfully",
            icon: "success",
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/Edit";
            }
          });
    } catch (error) {
        console.error('Error uploading certificate:', error);
        Swal.fire({
            title: "Error uploading certificate",
            icon: "error"
          });
    }
}
