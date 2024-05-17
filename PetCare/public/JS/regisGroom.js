window.onload = function() {
    const form = document.querySelector('form');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent form submission
        
        const fileInput = document.getElementById('file');
        const file = fileInput.files[0]; // Get the selected file
        
        if (file) {
            try {
                const userId = sessionStorage.getItem('id');
                const formData = new FormData(); // Create a new FormData object
                formData.append('certificate', file); // Append the file to FormData
                formData.append('userId', userId);

                // Send a POST request to upload the file
                const response = await fetch('/upload-groom-certificate', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    const data = await response.json(); // Get the response data
                    console.log('File uploaded successfully:', data);
                    alert("file")
                    // Now you can proceed to store the file name into the groomers table
                    // Write the code here to store the file name into the groomers table
                } else {
                    console.error('File upload failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        } else {
            console.error('No file selected.');
        }
    });
};
