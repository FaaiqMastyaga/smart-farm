document.addEventListener("DOMContentLoaded", () => {
    const plantContainer = document.getElementById("plant-container");

    plantContainer.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("card") || target.closest(".card")) {
            displaySchedule(target.closest(".card"));
        }
    })
    displayPlant();
});

async function displayPlant() {
    const action = 'get_plants';

    let response = await fetch(`http://localhost/smart-farm/php/actions.php?action=${action}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        emptyContainer("plant-card");
        const scheduleContainer = document.getElementById("schedule-container")
        scheduleContainer.classList.remove("active");
     
        const cardContainer = document.getElementById("plant-container");
        const plants = await response.json();
        plants.forEach(async plant => {
            const plantId = plant.tanaman_id;
            const plantName = plant.nama_tanaman;
            const currentDay = plant.hari;
            const remainingDay = plant.masa_panen - currentDay;
            let nextSchedule = 0;
            
            const card = createCard(plantId, plantName, currentDay, remainingDay, nextSchedule);
            cardContainer.appendChild(card);

            const action = "get_schedule";
            response = await fetch(`http://localhost/smart-farm/php/actions.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: action,
                    plantId: plantId,
                })
            });

        })
    }
}

function createCard(plantId, plantName, currentDay, remainingDay, nextSchedule) {
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
        </div>

        <div class="card-info">
            <div class="current-day">
                <h4>Progress</h4>
                <p><span>${currentDay} </span> Hari</p>
            </div>
            <div class="harvest-day">
                <h4>Panen dalam</h4>
                <p><span>${remainingDay} </span> Hari</p>
            </div>
        </div>

    `;
    return card;
}

async function displaySchedule(card) {
    const id = card.getAttribute("id");
    if (id === "plant-card") {
        const cards = document.querySelectorAll("#plant-card");
        cards.forEach((c) => {
            const checked = c.querySelector(".checked");
            checked.classList.remove("active");
        });

        const checked = card.querySelector(".checked");
        checked.classList.add("active");

        const scheduleContainer = document.getElementById("schedule-container");
        scheduleContainer.innerHTML = "";

        const action = "get_schedule";
        const plantId = card.querySelector("h2").getAttribute("id");

        const response = await fetch(`http://localhost/smart-farm/php/actions.php`, {
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
            const schedule = await response.json();
            displayTable(schedule, scheduleContainer);
        }
    }
}

function displayTable(data, tableContainer) {
    if (Object.keys(data).length) {
        // Clear the existing content of the table container
        tableContainer.innerHTML = "";
        
        // Create a table element
        const table = document.createElement("table");
    
        // Create the table header
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Pekan</th>
                    <th>Dosis (ppm)</th>
                    <th>Pupuk A (mL)</th>
                    <th>Pupuk B (mL)</th>
                    <th>Pupuk C (mL)</th>
                </tr>
            </thead>
        `
    
        // Create the table body
        const tbody = document.createElement("tbody");
    
        data.forEach((row) => {
            const tr = document.createElement("tr");
    
            const week = document.createElement("td");
            const dose = document.createElement("td");
            const pupuk_a = document.createElement("td");
            const pupuk_b = document.createElement("td");
            const pupuk_c = document.createElement("td");
    
            week.textContent = row.pekan;
            dose.textContent = row.dosis;
            pupuk_a.textContent = row.pupuk_a;
            pupuk_b.textContent = row.pupuk_b;
            pupuk_c.textContent = row.pupuk_c;
    
            tr.appendChild(week);
            tr.appendChild(dose);
            tr.appendChild(pupuk_a);
            tr.appendChild(pupuk_b);
            tr.appendChild(pupuk_c);
    
            tbody.appendChild(tr);
        })
        table.appendChild(tbody);
        tableContainer.appendChild(table);
    }
}