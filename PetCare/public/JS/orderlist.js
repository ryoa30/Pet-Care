document.addEventListener('DOMContentLoaded', () => {
    const role = sessionStorage.status;
    const userId = sessionStorage.id;

    if (role==1) {
        showUserHistory(userId);
    } else if(role==2){
        // showGroomerHistory(userId);
        showUserHistory(userId);
    } else if(role==3){
        // showVetHistory(userId);
    }
});

// function showGroomerHistory(userID)

function showUserHistory(userId) {
    fetch(`/api/groomerbookings/${userId}`)
        .then(response => response.json())
        .then(data => {
            const sections = {
                '0': document.getElementById('pending-history').querySelector('.booking-section'),
                '1': document.getElementById('ongoing-history').querySelector('.booking-section'),
                '2': document.getElementById('payment-history').querySelector('.booking-section'),
                '3': document.getElementById('rate-history').querySelector('.booking-section'),
                '4': document.getElementById('done-history').querySelector('.booking-section'),
                '-1': document.getElementById('rejected-history').querySelector('.booking-section')
            };

            data.forEach(booking => {
                const section = sections[booking.status];
                if (section) {
                    const formattedDate = formatDate(booking.servicedate); // Format the date
                    const bookingHTML = `
                        <div class="date">${formattedDate}</div>
                        <div class="book-list">
                            <div class="book-info">
                                <h1>${booking.name}<br>Grooming Service</h1>
                                <p>
                                    Price: Rp. ${booking.price} <br>
                                    Time: ${booking.servicetime} <br>
                                    Note: ${booking.servicenote} <br>
                                    Size: ${booking.animalsize} <br>
                                </p>
                            </div>
                            ${booking.status == 2 ? `<button class="live-chat-button" onclick="pindahhalaman('/transaction?bookingId=${booking.id}&type=1')">Payment</button>` : ''}
                            ${booking.status == 3 ? `<button class="live-chat-button" onclick="openPopup(${booking.groomerid}, 1, ${booking.id})">Rate</button>` : ''}
                        </div>
                    `;
                    section.innerHTML += bookingHTML;
                }
            });
        })
        .catch(error => console.error('Error fetching booking data:', error));

    fetch(`/api/vetbookings/${userId}`)
        .then(response => response.json())
        .then(data => {
            const sections = {
                '0': document.getElementById('pending-history').querySelector('.booking-section'),
                '1': document.getElementById('ongoing-history').querySelector('.booking-section'),
                '2': document.getElementById('payment-history').querySelector('.booking-section'),
                '3': document.getElementById('rate-history').querySelector('.booking-section'),
                '4': document.getElementById('done-history').querySelector('.booking-section'),
                '-1': document.getElementById('rejected-history').querySelector('.booking-section')
            };

            data.forEach(booking => {
                const section = sections[booking.status];
                if (section) {
                    const formattedDate = formatDate(booking.servicedate); // Format the date
                    const bookingHTML = `
                        <div class="date">${formattedDate}</div>
                        <div class="book-list">
                            <div class="book-info">
                                <h1>Dr. ${booking.name}<br>Vet Service</h1>
                                <p>
                                    Price: Rp. ${booking.price} <br>
                                    Time: ${booking.servicetime} <br>
                                    Note: ${booking.servicenote} 
                                </p>
                            </div>
                            ${booking.status == 2 ? `<button class="live-chat-button" onclick="pindahhalaman('/transaction?bookingId=${booking.id}&type=2')">Payment</button>` : ''}
                            ${booking.status == 3 ? `<button class="live-chat-button" onclick="openPopup(${booking.vetid}, 2, ${booking.id})">Rate</button>` : ''}
                        </div>
                    `;
                    section.innerHTML += bookingHTML;
                }
            });
        })
        .catch(error => console.error('Error fetching booking data:', error));
}

// Format date function
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}
