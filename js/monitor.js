document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menu");
    const plusCard = document.getElementById("plus-card");
    const plantContainer = document.getElementById("plant-container");

    menuButton.addEventListener("click", activateSideBar);
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

function activateSideBar() {
    const sidebar = document.querySelector(".sidebar");
    const section = document.querySelector(".section");
    sidebar.classList.toggle("active-page");
    section.classList.toggle("shrink-page");
}

function addPlant() {
    const body = document.querySelector("body");
    
    const addPlantContainer = document.createElement("div");
    addPlantContainer.classList.add("add-plant-container");
    addPlantContainer.innerHTML = `
        
    `;

    body.appendChild(addPlantContainer);
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
            <div class="delete-button">
                <i class="fa fa-trash"></i>
            </div>
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

    card.classList.toggle("active-card");
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
            const currentDay = plant.hari_ke;
            const remainingDay = plant.masa_panen;
    
            const card = createCard(plantName, currentDay, remainingDay);
            cardContainer.insertBefore(card, cardContainer.lastElementChild);
        });
    }
}