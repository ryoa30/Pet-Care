let selectedRating = 0;

function openPopup() {
  document.getElementById("popup-rating").style.display = "block";
}

function closePopup() {
  document.getElementById("popup-rating").style.display = "none";
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
    Swal.fire({
      title: "Thank you for rating our service!",
      icon: "success"
      // closePopup();
    });
    closePopup();
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