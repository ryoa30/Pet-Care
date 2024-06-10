let selectedRating = 0;
let serviceID = 0;
let serviceType = 0;
let bookingID = 0;

function openPopup(serviceId, servicetype, bookingid) {
  serviceID = serviceId;
  serviceType = servicetype;
  bookingID = bookingid;
  console.log(serviceId);
  if(serviceType==1){
    fetch(`/api/groomers/${serviceId}`)
      .then(response => response.json())
      .then(data => {
        const profilePicURL = `/uploads/${data.profile_pic_path}`;
        document.querySelector('.popup-header img').src = profilePicURL;
        document.querySelector('.popup-header h2').textContent = data.name;
        document.getElementById("popup-rating").style.display = "block";
      })
      .catch(error => console.error('Error fetching groomer data:', error));
  }else{
    fetch(`/api/vets/${serviceId}`)
      .then(response => response.json())
      .then(data => {
        const profilePicURL = `/uploads/${data.profile_pic_path}`;
        document.querySelector('.popup-header img').src = profilePicURL;
        document.querySelector('.popup-header h2').textContent = data.name;
        document.getElementById("popup-rating").style.display = "block";
      })
      .catch(error => console.error('Error fetching vet data:', error));
  }
}

function closePopup() {
  document.getElementById("popup-rating").style.display = "none";
  serviceID = 0;
  serviceType = 0;
}

function selectStar(star) {
  const stars = document.querySelectorAll('.star-rating span');
  stars.forEach((item) => {
    item.classList.remove('checked');
  });
  star.classList.add('checked');
  selectedRating = star.getAttribute('data-value');
  
  // Update star colors based on selected rating
  stars.forEach((item, index) => {
    if (index < selectedRating) {
      item.classList.add('yellow');
    } else {
      item.classList.remove('yellow');
    }
  });
}

function submitRating() {
  if (selectedRating >= 1 && selectedRating <= 5) {
    if(serviceType==1){
      fetch(`/api/groomers/${serviceID}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating: selectedRating })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Update booking status to 4
          fetch(`/api/groomerbookings/${bookingID}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 4 })
          })
          .then(response => response.json())
          .then(statusData => {
            if (statusData.success) {
              Swal.fire({
                title: "Thank you for rating our service!",
                icon: "success"
              });
            } else {
              Swal.fire({
                title: "Error updating booking status!",
                icon: "error"
              });
            }
          })
          .catch(error => console.error('Error updating booking status:', error));
        } else {
          Swal.fire({
            title: "Error submitting rating!",
            icon: "error"
          });
        }
  
        closePopup();
      })
      .catch(error => console.error('Error submitting rating:', error));
    }else{
      fetch(`/api/vets/${serviceID}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating: selectedRating })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Update booking status to 4
          fetch(`/api/vetbookings/${bookingID}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 4 })
          })
          .then(response => response.json())
          .then(statusData => {
            if (statusData.success) {
              Swal.fire({
                title: "Thank you for rating our service!",
                icon: "success"
              });
            } else {
              Swal.fire({
                title: "Error updating booking status!",
                icon: "error"
              });
            }
          })
          .catch(error => console.error('Error updating booking status:', error));
        } else {
          Swal.fire({
            title: "Error submitting rating!",
            icon: "error"
          });
        }
  
        closePopup();
        pindahhalaman('/OrderHistory');
      })
      .catch(error => console.error('Error submitting rating:', error));
    }
  } else {
    Swal.fire({
      title : "Please select a rating between 1 and 5!",
      icon: "error"
    });
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  const stars = document.querySelectorAll('.star-rating span');
  stars.forEach((star) => {
    star.addEventListener('click', () => {
      selectStar(star);
    });
  });
});
