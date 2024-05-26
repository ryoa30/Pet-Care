document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/vets')
        .then(response => response.json())
        .then(data => {
            const groomerContainer = document.querySelector('.Card-Groomer');

            data.forEach(groomer => {
                const groomerProfile = document.createElement('div');
                groomerProfile.className = 'Groomer-profile';

                groomerProfile.innerHTML = `
                    <div class="Groomer-picture">
                        <img src="/uploads/${groomer.profile_pic_path}" alt="${groomer.name}" />
                    </div>
                    <div class="Groomer-text">
                        <h3>${groomer.name}</h3>
                        <p>${groomer.rating} / 5</p>
                        <button class="See-more" onclick="showGroomerModal(${groomer.id})">See more</button>
                    </div>
                `;

                groomerContainer.appendChild(groomerProfile);
            });
        })
        .catch(error => console.error('Error fetching groomers:', error));
});

function showGroomerModal(groomerId) {
    fetch(`/api/vets/${groomerId}`)
        .then(response => response.json())
        .then(groomer => {
            const modal = document.getElementById('myModal');
            const modalContent = modal.querySelector('.modal-content');

            console.log(groomer);
            let scheduleButtons = '';
            groomer.schedules.forEach(schedule => {
                scheduleButtons += `<button>${schedule.availibletime}</button>`;
            });

            modalContent.innerHTML = `
                <span class="close" onclick="closeModal()">&times;</span>
                <div class="img-pop">
                    <img src="/uploads/${groomer.profile_pic_path}" alt="${groomer.name}" />
                </div>
                <div class="text-pop">
                    <h1>${groomer.name}</h1>
                    <h2>Description</h2>
                    <p>${groomer.description}</p>
                    <h2>Scheduling</h2>
                    <p>Available on: ${groomer.scheduling}</p>
                    <div class="pop-button">
                        ${scheduleButtons}
                    </div>
                    <h2>Price: Rp. ${groomer.price}</h2>
                    <button class="Btn-book" onclick="pindahhalaman('/BookVet?groomerId=${groomerId})">Book</button>
                    <button class="Btn-book" onclick="pindahhalaman('/LiveChat')">Live Chat</button>
                </div>
            `;

            document.getElementById('footer').style.display = 'none';
            modal.style.display = 'block';
            
        })
        .catch(error => console.error('Error fetching groomer details:', error));
}

function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
    document.getElementById('footer').style.display = 'block';
}