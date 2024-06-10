document.addEventListener('DOMContentLoaded', () => {
    const role = sessionStorage.status;
    const userId = sessionStorage.id;

    if (role==1) {
        showUserHistory(userId);
    } else if(role==2){
        showGroomerHistory(userId);
    } else if(role==3){
        showVetHistory(userId);
    }
});

function showVetHistory(userId){
    fetch(`/api/vetbookings/${userId}/role`)
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
                             ${booking.status == 0 ? `
                                <div><button class="live-chat-button" onclick="updateStatusvet(${booking.id}, 1)">Accept</button>
                                <button class="live-chat-button" onclick="updateStatusvet(${booking.id}, -1)">Reject</button></div>` : ''}
                            ${booking.status == 1 ? `<button class="live-chat-button" onclick="updateStatusvet(${booking.id}, 2)">Done</button>` : ''}
                        </div>
                    `;
                    section.innerHTML += bookingHTML;
                }
            });
        })
        .catch(error => console.error('Error fetching booking data:', error));
}

function showGroomerHistory(userId){
    fetch(`/api/groomerbookings/${userId}/role`)
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
                            ${booking.status == 0 ? `
                                <div><button class="live-chat-button" onclick="updateStatus(${booking.id}, 1)">Accept</button>
                                <button class="live-chat-button" onclick="updateStatus(${booking.id}, -1)">Reject</button></div>` : ''}
                            ${booking.status == 1 ? `<button class="live-chat-button" onclick="updateStatus(${booking.id}, 2)">Done</button>` : ''}
                        </div>
                    `;
                    section.innerHTML += bookingHTML;
                }
            });
        })
        .catch(error => console.error('Error fetching booking data:', error));
}

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

function updateStatus(bookingId, status){
    fetch(`/api/groomerbookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: status })
      })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/OrderHistory';
        } else {
            console.error('Error updating booking status:', data.error);
        }
    })
    .catch(error => console.error('Error updating booking status:', error));
}

function updateStatusvet(bookingId, status){
    fetch(`/api/vetbookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 3 })
      })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/OrderHistory';
        } else {
            console.error('Error updating booking status:', data.error);
        }
    })
    .catch(error => console.error('Error updating booking status:', error));
}
