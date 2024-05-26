let serviceId = null;

window.onload = async function() {
    // Retrieve the user's name from sessionStorage
    const userName = sessionStorage.getItem('name');
    const userId = sessionStorage.getItem('id');
    const status = sessionStorage.getItem('status');
    // console.log(userId);
    
    // If the user's name is available
    if (userName) {
        try {
            // Send a request to the server to fetch user data based on the name
            let response = null;
            if(status == 2){
                response = await fetch(`/api/groomersedit/${userId}`);
            }else if(status == 3){
                response = await fetch(`/api/vetsedit/${userId}`);
            }
            
            const userData = await response.json();
            serviceId = userData.id;
            // console.log(userData);
            let response2 = null;
            if(status == 2){
                response2 = await fetch(`/api/groomerschedule/${userData.id}`);
            }else if(status == 3){
                response2 = await fetch(`/api/vetschedule/${userData.id}`);
            }
            
            const schedule = await response2.json();
            // Populate the input fields with the user's data
            document.getElementById("description").value = userData.description;
            document.getElementById("scheduling").value = userData.scheduling;
            document.getElementById("price").value = userData.price;

            console.log(schedule);

            schedule.forEach(scheduleTime => {
                const time = scheduleTime.availibletime;
                // .substring(0, 5); // Extract 'HH:MM' from 'HH:MM:SS'
                const timeButton = document.querySelector(`button[data-time="${time}"]`);
                if (timeButton) {
                    console.log("masuk " + time);
                    timeButton.classList.add('selected'); // Add a class to mark it as selected
                }
            });
            
           
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
  }

function getSelectedAndNotSelectedTimes() {
    const selectedTimes = [];
    const notSelectedTimes = [];

    document.querySelectorAll('.times button').forEach(button => {
        if (button.classList.contains('selected')) {
            selectedTimes.push(button.getAttribute('data-time'));
        } else {
            notSelectedTimes.push(button.getAttribute('data-time'));
        }
    });

    return { selectedTimes, notSelectedTimes };
}

async function updateSchedule() {
    const { selectedTimes, notSelectedTimes } = getSelectedAndNotSelectedTimes();

    if(sessionStorage.status == 2){
        try {
            const response = await fetch('/api/updateGroomerSchedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ groomerId: serviceId, selectedTimes, notSelectedTimes })
            });
    
            if (response.ok) {
                console.log('Schedule updated successfully');
            } else {
                console.error('Error updating schedule:', await response.json());
            }
        } catch (error) {
            console.error('Error updating schedule:', error);
        }
    }else if(sessionStorage.status == 3){
        try {
            const response = await fetch('/api/updateVetSchedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ vetId: serviceId, selectedTimes, notSelectedTimes })
            });
    
            if (response.ok) {
                console.log('Schedule updated successfully');
            } else {
                console.error('Error updating schedule:', await response.json());
            }
        } catch (error) {
            console.error('Error updating schedule:', error);
        }
    }
}

// Attach the update function to the save button
document.querySelector('.save').addEventListener('click', updateSchedule);


document.querySelectorAll('.times button').forEach(button => {    
    button.addEventListener('click', () => {
        button.classList.toggle('selected');
    });
});

document.querySelector('.save').addEventListener('click', async (event) => {
    event.preventDefault();
  
    // Gather updated user information from input fields;
    const description = document.getElementById("description").value;
    const scheduling = document.getElementById("scheduling").value;
    const price = document.getElementById("price").value;
    // Send a POST request to update user information
    if(sessionStorage.status == 2){
        try {
            const response = await fetch('/updategroomer-servicedetail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: serviceId,
                    description: description,
                    scheduling: scheduling,
                    price: price
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
    }else if(sessionStorage.status == 3){
        try {
            const response = await fetch('/updatevet-servicedetail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: serviceId,
                    description: description,
                    scheduling: scheduling,
                    price: price
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
    }
  
  });