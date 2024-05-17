const nav = document.querySelector('.garis-tiga input');
const respon = document.querySelector('nav ul');    

window.onload = () =>{
    if (window.location.pathname === '/') {
        if (sessionStorage.name) {
            location.href = '/homepage';
        }
    }else if(window.location.pathname === '/homepage'){
        if(!sessionStorage.name){
            location.href = '/login';
        }
    }
}

nav.addEventListener('click', function () {
    respon.classList.toggle('muncul-responsive');
})

function pindahhalaman(halaman){
    window.location.href = halaman;
}

document.addEventListener('DOMContentLoaded', (event) => {
    var modal = document.getElementById("myModal");
    var btns = document.querySelectorAll(".See-more");
    var span = document.getElementsByClassName("close")[0];

    btns.forEach(btn => {
        btn.onclick = function() {
            modal.style.display = "block";
        }
    });

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
