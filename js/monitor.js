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
    addPlantContainer.remove();
    
    const barrier = document.querySelector(".barrier");
    barrier.remove();
    
    const content = document.querySelector(".wrapper");
    content.classList.remove("dark");
}

function createBarrier() {
    const body = document.querySelector("body");
    const barrier = document.createElement("div");
    barrier.classList.add("barrier");

    const content = document.querySelector(".wrapper");
    content.classList.add("dark");

    body.appendChild(barrier);
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
    `;
            
    const scheduleDisplay = document.createElement("div");
    scheduleDisplay.classList.add("schedule-display");

    const cancelButton = document.createElement("button");
    cancelButton.setAttribute("id", "cancel-button");
    cancelButton.textContent = "Cancel";
    
    formContainer.appendChild(formInput);
    formContainer.appendChild(formSelect);
    formContainer.appendChild(cancelButton); 
    addPlantContainer.appendChild(formContainer);
    addPlantContainer.appendChild(scheduleDisplay);
    body.appendChild(addPlantContainer);
    createBarrier();

    cancelButton.addEventListener("click", closeAddPlantContainer);
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

function closeDeletePlantContainer() {
    const addPlantContainer = document.querySelector(".delete-plant-container");
    addPlantContainer.remove();

    const barrier = document.querySelector(".barrier");
    barrier.remove();
    
    const content = document.querySelector(".wrapper");
    content.classList.remove("dark");
}

function deletePlant(card) {
    const body = document.querySelector("body");

    const deletePlantContainer = document.createElement("div");
    deletePlantContainer.classList.add("delete-plant-container");
    deletePlantContainer.textContent = "Delete";
    deletePlantContainer.innerHTML = `
        <div class="text-content">
            <h2>Are you sure?</h2>
            <br>
            <p>This change cannot be undone. All values associated with this field will be lost.</p>
        </div>
        <div class="button-container">
            <button class="button" id="delete-button">Delete</button>
            <button class="button" id="cancel-button">Cancel</button>
        </div>
    `;

    body.appendChild(deletePlantContainer);
    createBarrier();

    const deleteButton = document.getElementById("delete-button");
    const cancelButton = document.getElementById("cancel-button");

    deleteButton.addEventListener("click", () => {
        card.remove();
        closeDeletePlantContainer();
    });
    cancelButton.addEventListener("click", closeDeletePlantContainer)
}

function activateCard(card) {
    const id = card.getAttribute("id");
    if (id === "plant-card") {
        const cards = document.querySelectorAll("#plant-card");
        cards.forEach((c) => {
            c.classList.remove("active");
        });

        card.classList.add("active");
    }
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