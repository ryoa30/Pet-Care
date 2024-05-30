document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const groomerId = params.get('groomerId');

    if (groomerId) {
        fetchGroomerDetails(groomerId);
    } else {
        document.querySelector('.groomer-info').innerHTML = '<p>Error: No groomer selected for booking.</p>';
    }
});

let selectedTime = null;

function fetchGroomerDetails(groomerId) {
    fetch(`/api/vets/${groomerId}`)
        .then(response => response.json())
        .then(groomer => {
            const groomerImage = document.querySelector('.groomer-image');
            const groomerName = document.querySelector('.groomer-name');
            const bookingOptions = document.querySelector('.booking-options');

            groomerImage.src = `/uploads/${groomer.profile_pic_path}`;
            groomerImage.alt = groomer.name;
            groomerName.textContent = groomer.name;

            let scheduleButtons = '';
            groomer.schedules.forEach(schedule => {
                scheduleButtons += `<button class="time-btn" data-time="${schedule.availibletime}">${schedule.availibletime}</button>`;
            });

            bookingOptions.innerHTML = `
                <div class="option">
                    <span>Time:</span>
                    ${scheduleButtons}
                </div>
                <div class="option">
                    <label for="calendar">Kalender</label>
                    <input type="date" id="calendar">
                </div>
                <div class="option">
                    <label for="address">Address</label>
                    <input type="text" id="address" placeholder="Type here...">
                </div>
                <div class="option">
                    <label for="note">Note</label>
                    <input type="text" id="note" placeholder="Type here...">
                </div>
            `;

            document.querySelectorAll('.time-btn').forEach(button => {
                button.addEventListener('click', () => {
                    // Remove 'selected' class from all buttons
                    document.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('selected'));
                    // Add 'selected' class to the clicked button
                    button.classList.add('selected');
                    // Update the selectedTime variable
                    selectedTime = button.getAttribute('data-time');
                });
            });

            const bookBtn = document.getElementById('bookBtn');
            bookBtn.addEventListener('click', () => {
                bookAppointment(groomerId, groomer.price);
            });
        })
        .catch(error => console.error('Error fetching groomer details:', error));
}



function bookAppointment(vetId, price) {
    if (!selectedTime) {
        alert('Please select a time.');
        return;
    }

    const calendar = document.getElementById('calendar').value;
    const address = document.getElementById('address').value;
    const note = document.getElementById('note').value;
    const userId = sessionStorage.getItem('id');

    const bookingDetails = {
        vetId,
        userId,
        selectedTime,
        calendar,
        address,
        note,
        price
    };

    // Send booking details to server
    fetch('/api/bookvet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingDetails)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Booking successful!');
            pindahhalaman("/OrderHistory")
            // Redirect or update UI as needed
        } else {
            alert(data.message || 'Booking failed. Please try again.');
        }
    })
    .catch(error => console.error('Error booking appointment:', error));
}

