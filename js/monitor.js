document.addEventListener("DOMContentLoaded", () => {
    const plusCard = document.getElementById("plus-card");
    const plantContainer = document.getElementById("plant-container");

    plusCard.addEventListener("click", showpopUp);

    plantContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("delete-button") || target.closest(".delete-button")) {
        deletePlant(target.closest(".card"));
	} else if (target.classList.contains("card") || target.closest(".card")) {
        displayProgress(target.closest(".card"));
    }
    });

    displayPlant();

    // Gunakan Fetch API untuk mengambil konten dari view.php
    fetch('../php/view_table.php')
        .then(response => response.text())
        .then(data => {
            // Set konten dari viewTable dengan konten dari view.php
            document.querySelector('.viewTable').innerHTML = data;
        })
        .catch(error => {
            console.error('Error:', error);
        });

});
function showpopUp() {
    document.querySelector(".popUp").classList.add("active");
}
// document.querySelector().addEventListener("click", function(){
//     document.querySelector(".popUp").classList.add("active");

// });

document.querySelector(".popUp .close-btn").addEventListener("click", function(){
    document.querySelector(".popUp").classList.remove("active");

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
        cancelButton.remove();
        closeBox(addPlantBox);
    });
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

    deleteButton.addEventListener("click", async () => {
        const action = "delete_plant";
        const plantId = card.querySelector("h2").getAttribute("id");
        console.log(plantId);

        const response = await fetch(`http://localhost/smart-farm/php/actions.php?action=${action}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: action,
                plantId: plantId,
            }),
        });

        if (response.ok) {
            displayPlant();
            console.log("Successfully delete plant.");
        } else {
            console.error("Failed to delete plant.");
        }

        closeBox(deletePlantBox);
    });
    
    cancelButton.addEventListener("click", () => {
        closeBox(deletePlantBox)
    });
}

async function displayPlant() {
    const action = 'get_plants';
    
    const response = await fetch(`http://localhost/smart-farm/php/actions.php?action=${action}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (response.ok) {
        emptyContainer("plant-card");
        const cardContainer = document.getElementById("plant-container");
        const plants = await response.json();
        plants.forEach(plant => {
            const plantId = plant.tanaman_id;
            const plantName = plant.nama_tanaman;
            const currentDay = plant.hari;
            const remainingDay = plant.masa_panen - currentDay;

            const card = createCard(plantId, plantName, currentDay, remainingDay);
            cardContainer.insertBefore(card, cardContainer.lastElementChild);
        });
    }
}

function createCard(plantId, plantName, currentDay, remainingDay) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("id", "plant-card");
    
    card.innerHTML = `
        <div class="card-title">
            <div class="checked">
                <i class="fa fa-circle"></i>
            </div>
            <div class="title">
                <h2 id=${plantId}>${plantName}</h2>
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

        <div class="card-chart"></div>
    `;
    return card;
}
    
async function displayProgress(card) {
    const id = card.getAttribute("id");
    if (id === "plant-card") {
        const cards = document.querySelectorAll("#plant-card");
        cards.forEach((c) => {
            const checked = c.querySelector(".checked");
            checked.classList.remove("active");
        });

        const checked = card.querySelector(".checked");
        checked.classList.add("active");

        const progressText = document.querySelectorAll(".progress-text");
        progressText.forEach((text) => {
            text.classList.add("active");
        })

        const progressContainer = document.getElementById("progress-container");
        progressContainer.classList.add("active");

        const action = "get_plant_progress";
        const plantId = card.querySelector("h2").getAttribute("id");
        
        const response = await fetch(`http://localhost/smart-farm/php/actions.php?action=${action}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: action,
                plantId: plantId,
            }),
        });

        if (response.ok) {
            emptyContainer("progress-card")
            const plantProgress = await response.json();

            let weeks = [];
            let pupuk_a = [];
            let pupuk_b = [];
            let pupuk_c = [];

            plantProgress.forEach(progress => {
                weeks.push(parseInt(progress.pekan));
                pupuk_a.push(parseInt(progress.pupuk_a));
                pupuk_b.push(parseInt(progress.pupuk_b));
                pupuk_c.push(parseInt(progress.pupuk_c));
            });

            const canvas = document.createElement("canvas");
            canvas.setAttribute("id", "progress-chart");
            
            const card = document.createElement("div");
            card.classList.add("card");
            card.setAttribute("id", "progress-card");
            card.appendChild(canvas);
            
            const progressContainer = document.getElementById("progress-container");
            progressContainer.appendChild(card);

            let progressChart = new Chart("progress-chart", {
            type: "line",
                data: {
                    labels: weeks,
                    datasets: [{
                    fill: false,
                    tension: 0,
                    backgroundColor: "rgba(255, 0, 90, 1)",
                    borderColor: "rgba(255, 0, 90, 1)",
                    data: pupuk_a
                    }]
                },
                options: {
                    legend: {display: false},
                    scales: {
                        yAxes: [{ticks: {min: 0, max:100}}],
                    }
                }
            });
        }
    }
}

// Tambahan
// Tab
document.querySelectorAll(".tab-btn").forEach(tabBtn => {
    tabBtn.addEventListener("click", function() {
        const tabName = this.getAttribute("data-tab");
        document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        document.querySelectorAll(".tab-content").forEach(tabContent => tabContent.classList.remove("active"));
        document.querySelector(`.tab-content.${tabName}`).classList.add("active");
    });
});

// <View Table -->
