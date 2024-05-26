window.onload = () => {
    if (sessionStorage.status == 3 || sessionStorage.status == 2) {
      location.href = "/Edit";
    }
  };

document.querySelector('.submit').addEventListener('click', async (event) => {
    event.preventDefault();
    await uploadCertificate();
});

async function uploadCertificate() {
    const vetForm = document.getElementById("vetForm");
    const userId = sessionStorage.getItem('id');
    const formData = new FormData(vetForm);
    formData.append('userId', userId);

    try {
        const response = await fetch('/register-vet', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                title: "Veterinarian registered successfully",
                icon: "success",
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.isConfirmed) {
                    sessionStorage.status = 3;
                    window.location.href = '/Edit';
                }
              });
        } else {
            Swal.fire({
                title: `Error: ${result.error}`,
                icon: "error"
              });
        }
    } catch (error) {
        console.error('Error uploading files:', error);
        Swal.fire({
            title: "Error uploading files",
            icon: "error"
          });
    }
}
