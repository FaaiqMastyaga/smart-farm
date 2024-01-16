document.addEventListener("DOMContentLoaded", () => {
    const plusCard = document.getElementById("plus-card");
    const plantContainer = document.getElementById("plant-container");

    plusCard.addEventListener("click", addPlant);

    plantContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("delete-button") || target.closest(".delete-button")) {
        deletePlant(target.closest(".card"));
	} else if (target.classList.contains("card") || target.closest(".card")) {
        activateCard(target.closest(".card"));
    }
    });

    displayCard();
});

function closeAddPlantContainer() {
    const addPlantContainer = document.querySelector(".add-plant-container");
    const content = document.querySelector(".wrapper");
    addPlantContainer.remove();
    content.classList.remove("dark")
}

function activateSideBar() {
    const sidebar = document.querySelector(".sidebar");
    const section = document.querySelector(".section");
    sidebar.classList.toggle("active");
    section.classList.toggle("shrink");
}

function addPlant() {
    const body = document.querySelector("body");

    const addPlantContainer = document.createElement("div");
    addPlantContainer.classList.add("add-plant-container");
    
    const formContainer = document.createElement("div");
    formContainer.classList.add("form-container");

    const scheduleContainer = document.createElement("div");
    scheduleContainer.classList.add("schedule-container");
    

    const formInput = document.createElement("div");
    formInput.classList.add("form-input");
    formInput.innerHTML = `
        <label for="plant-name">Nama Tanaman:</label>
        <input id="plant-name" type="text"> 
        <br>
        <label for="target-day">Target Panen:</label>
        <input id="target-day" type="number"> 
        <br>
        <label for="schedule">Jadwal: </label>
        <input 
            id="schedule"
            type="file" 
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
        > 
        <br>
        <button id="submit-button">Submit</button>  
        `;
        
        const formSelect = document.createElement("div");
    formSelect.classList.add("form-select");
    formSelect.innerHTML = `
        <label for="plan-list">Nama Tanaman:</label>
        <input list="plant-list">
        <datalist id="plant-list">
            <option value="Bayam">
            <option value="Kangkung">
            <option value="Jagung">
            <option value="Singkong">
            <option value="Cabai">
            <option value="Sawi">
        </datalist>
        <br>
        <button id="submit-button">Submit</button>  
            `;
            
    const scheduleDisplay = document.createElement("div");
    scheduleDisplay.classList.add("schedule-display");
    
    formContainer.appendChild(formInput);
    formContainer.appendChild(formSelect);
    addPlantContainer.appendChild(formContainer);
    addPlantContainer.appendChild(scheduleDisplay);
    body.appendChild(addPlantContainer);

    const content = document.querySelector(".wrapper");
    content.classList.add("dark");

    const submitButton = document.getElementById("submit-button");
    submitButton.addEventListener("click", closeAddPlantContainer);
    
}


function createCard(plantName, currentDay, remainingDay) {
    if (!currentDay) {
        currentDay = 0;
    }

    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("id", "plant-card");

    card.innerHTML = `
        <div class="card-title">
            <div class="checked">
                <i class="fa fa-circle"></i>
            </div>
            <div class="title">
                <h2>${plantName}</h2>
            </div>
            <button class="delete-button">
                <i class="fa fa-trash"></i>
            </button>
        </div>

        <div class="card-info">
            <div class="current-day">
                <h4>Hari ke</h4>
                <p><span>${currentDay} </span> D</p>
                </div>
                <div class="harvest-day">
                <h4>Panen dalam</h4>
                <p><span>${remainingDay} </span> D</p>
            </div>
        </div>

        <div class="card-image">

        </div>
    `;
    return card;
}

function deletePlant(card) {
    const confirmation = confirm("Are you sure you want to delete this?");

    if (confirmation) {
        card.remove();
    }
}

function activateCard(card) {
    const cards = document.querySelectorAll("#plant-card");
    cards.forEach((c) => {
        c.classList.remove("active-card");
    });

    card.classList.add("active-card");
}

async function displayCard() {
    const action = 'get_plants';
    
    const response = await fetch(`http://localhost/smart-farm/php/actions.php?action=${action}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (response.ok) {
        const cardContainer = document.getElementById("plant-container");

        const plants = await response.json();
        plants.forEach(plant => {
            const plantName = plant.nama_tanaman;
            const currentDay = plant.hari;
            const remainingDay = plant.panen;

            const card = createCard(plantName, currentDay, remainingDay);
            cardContainer.insertBefore(card, cardContainer.lastElementChild);
        });
    }
}