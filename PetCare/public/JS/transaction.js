document.addEventListener('DOMContentLoaded', (event) => {
    var modal = document.getElementById("invoiceModal");
    var btn = document.getElementById("invoice");
    var span = document.getElementsByClassName("close")[0];

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
