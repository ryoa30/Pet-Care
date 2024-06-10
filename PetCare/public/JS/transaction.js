document.addEventListener('DOMContentLoaded', (event) => {
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get('bookingId');
    const type = params.get('type');
    const userId = sessionStorage.id;
    var modal = document.getElementById("invoiceModal");
    var btn = document.getElementById("invoice");
    var span = document.getElementsByClassName("close")[0];

    console.log(bookingId);
    // Fetch booking details and populate modal
    if (bookingId) {
        if(type==1){
            fetch(`/api/groomerbookingPay/${bookingId}`)
                .then(response => response.json())
                .then(booking => {
                    document.querySelector(".invoice-details").innerHTML = `
                        <p><strong>Date:</strong> ${booking.today}</p>
                        <p><strong>Customer:</strong> ${booking.customerName}</p>
                        <p><strong>Items: Grooming Service</strong></p>
                        <p><strong>Total:</strong> Rp. ${booking.price}</p>
                        <div class="invoice-btn">
                            <button class="invoice-button" onclick="payInvoice(${bookingId}, ${type})">Pay</button>
                        </div>
                    `;
                })
                .catch(error => console.error('Error fetching booking details:', error));
        }else{
            fetch(`/api/vetbookingPay/${bookingId}`)
                .then(response => response.json())
                .then(booking => {
                    document.querySelector(".invoice-details").innerHTML = `
                        <p><strong>Date:</strong> ${booking.today}</p>
                        <p><strong>Customer:</strong> ${booking.customerName}</p>
                        <p><strong>Items: Vet Service</strong></p>
                        <p><strong>Total:</strong> Rp. ${booking.price}</p>
                        <div class="invoice-btn">
                            <button class="invoice-button" onclick="payInvoice(${bookingId}, ${type})">Pay</button>
                        </div>
                    `;
                })
                .catch(error => console.error('Error fetching booking details:', error));
        }
    }

    btn.onclick = function() {
        modal.style.display = "flex";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

function payInvoice(bookingId, type) {
    if(type==1){
        fetch(`/api/groomerbookings/${bookingId}/status`, {
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
    }else{
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
}
