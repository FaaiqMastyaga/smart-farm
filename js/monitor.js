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

function addPlant() {
    // display box to add plant
    const addPlantBox = document.getElementById("add-plant-box");
    addPlantBox.classList.add("active"); 
    
    // create button inside form container
    const cancelButton = document.createElement("button");
    cancelButton.setAttribute("id", "cancel-button");
    cancelButton.textContent = "Cancel";
    const formContainer = document.querySelector(".form-container");
    formContainer.appendChild(cancelButton); 
    
    // activate form input tab
    const formInput = document.getElementById("form-input");
    formInput.classList.add("active");
    
    // activate form select tab
    const formSelect = document.getElementById("form-select");
    formSelect.classList.add("active"); // uncomment to activate
    
    // activate barrier -> penghalang supaya ga bisa ngeklik konten lain selain box untuk nambah tanaman
    const barrier = document.querySelector(".barrier");
    barrier.classList.add("active");
    
    // darken the content
    const content = document.querySelector(".wrapper");
    content.classList.add("dark");
    
    // exit add plant box
    cancelButton.addEventListener("click", () => {
        addPlantBox.classList.remove("active");
        cancelButton.remove();
        barrier.classList.remove("active");
        content.classList.remove("dark");
    });
}

function createCard(plantName, currentDay, remainingDay) {
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
    const deletePlantBox = document.getElementById("delete-plant-box");
    deletePlantBox.classList.add("active");

    const barrier = document.querySelector(".barrier");
    barrier.classList.add("active");
    
    const content = document.querySelector(".wrapper");
    content.classList.add("dark");

    const deleteButton = document.getElementById("delete-button");
    const cancelButton = document.getElementById("cancel-button");

    deleteButton.addEventListener("click", () => {
        card.remove();
        deletePlantBox.classList.remove("active");
        barrier.classList.remove("active");
        content.classList.remove("dark");
    });
    
    cancelButton.addEventListener("click", () => {
        deletePlantBox.classList.remove("active");
        barrier.classList.remove("active");
        content.classList.remove("dark");
    });
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