document.addEventListener("DOMContentLoaded", () => {
    const plusCard = document.getElementById("plus-card");
    const plantContainer = document.getElementById("plant-container");
    const fileInput = document.querySelector('input[name="jadwal"');

    plusCard.addEventListener("click", handlePlusCard);
    
    fileInput.addEventListener("change", handleFileSelect);
    
    plantContainer.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("delete-button") || target.closest(".delete-button")) {
            deletePlant(target.closest(".card"));
        } else if (target.classList.contains("card") || target.closest(".card")) {
            displayProgress(target.closest(".card"));
        }
    });
  
    displayPlant();
});

function handlePlusCard() {
    // display box to add plant
    const addPlantBox = document.getElementById("add-plant-box");
    addPlantBox.classList.add("active"); 
    
    // activate barrier
    const barrier = document.querySelector(".barrier");
    barrier.classList.add("active");
    
    // darken the content
    const content = document.querySelector(".wrapper");
    content.classList.add("dark");
        
    const createNewButton = document.getElementById("create-new-button");
    const createExistingButton = document.getElementById("create-existing-button");
    
    const createNewTab = document.getElementById("create-new-tab");
    const createExistingTab = document.getElementById("create-existing-tab");
    
    const submitCreateNewButton = document.getElementById("submit-create-new");
    const submitCreateExistingButton = document.getElementById("submit-create-existing");

    const closeButton = addPlantBox.querySelector(".close-button");

    // change to create new tab
    createNewButton.addEventListener("click", () => {
        changeTabBehavior(createNewButton, createNewTab);
    });
    
    // change to create existing tab
    createExistingButton.addEventListener("click", () =>  {
        changeTabBehavior(createExistingButton, createExistingTab);
    });

    submitCreateNewButton.addEventListener("click", () => {
        addPlant();
        closeBox(addPlantBox);
    });
    
    submitCreateExistingButton.addEventListener("click", () => {
        addPlant();
        closeBox(addPlantBox);
    });
    
    // close the popup
    closeButton.addEventListener("click", () => {
        changeTabBehavior(createNewButton, createNewTab);
        closeBox(addPlantBox);
    });
}

function changeTabBehavior(button, tab) {
    const addPlantBox = document.getElementById("add-plant-box");
    const tabButton = addPlantBox.querySelectorAll(".tab-button");
    const tabForm = addPlantBox.querySelectorAll(".tab-form");
    const input = addPlantBox.querySelectorAll("input");
    const submit = addPlantBox.querySelectorAll(".submit");

    // empty all input box
    input.forEach((i) => {
        i.value = '';
    });
    submit.forEach((s) => {
        s.value = "Submit";
    })
    // unactivate all tab button
    tabButton.forEach(button => {
        button.classList.remove("active");
    })
    // unactivate all tab form
    tabForm.forEach(form => {
        form.classList.remove("active");
    })

    const tableContainer = document.querySelector(".tab-table");
    tableContainer.innerHTML = "";
    
    button.classList.add("active");
    tab.classList.add("active");
}

async function addPlant() {
    const plantName = document.getElementById("nama_tanaman").value;
    const harvestDay = document.getElementById("masa_panen").value;
    const table = document.querySelector("tbody").querySelectorAll("tr");

    let schedule = [];
    table.forEach((tr) => {
        let row = []; 
        const data = tr.querySelectorAll("td").forEach((data) => {
            row.push(data.textContent);
        });
        schedule.push(row);
    });

    const action = "add_plant";

    const response = await fetch(`http://localhost/smart-farm/php/actions.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: action,
            plantName: plantName,
            harvestDay: harvestDay,
            schedule: schedule,
        }),
    });

    if (response.ok) {
        console.log(response);
        displayPlant();
    }
}

function handleFileSelect(evt) {
    const files = evt.target.files;
    const file = files[0];
  
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = e.target.result;
            
          // Call the function to parse the Excel data
          parseExcelDataToTable(data);
        };
      
        // Read the file as binary
        reader.readAsBinaryString(file);
    } else {
        const tableContainer = document.querySelector(".tab-table");
        tableContainer.innerHTML = "";
    }
} 

function parseExcelDataToTable(data) {    
    const tableContainer = document.querySelector(".tab-table");

    const workbook = XLSX.read(data, {type: "binary"});
    const sheetName = "Sheet1";

    if (!sheetName) {
        console.error("No sheets found in the Excel file.");
        return;
    }
    
    const sheet = workbook.Sheets[sheetName];
    const table = XLSX.utils.sheet_to_json(sheet, {header: 1});
    
    displayTable(table, tableContainer)
}

function displayTable(data, tableContainer) {
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

    for (let i = 1; i < data.length; i++) {
        const rowData = data[i];
        const tr = document.createElement("tr");

        rowData.forEach((cellData) => {
            const td = document.createElement("td");
            td.textContent = cellData;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    tableContainer.appendChild(table);
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
        const cardChart = card.querySelector(".card-chart");
        cardChart.innerHTML = "";

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
    
    let response = await fetch(`http://localhost/smart-farm/php/actions.php?action=${action}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (response.ok) {
        emptyContainer("plant-card");
        const progressContainer = document.getElementById("progress-container");
        progressContainer.classList.remove("active");
        const progressText = document.querySelectorAll(".progress-text");
        progressText.forEach((t) => {
            t.classList.remove("active");
        });
    
        const cardContainer = document.getElementById("plant-container");
        const plants = await response.json();
        plants.forEach(async plant => {
            const plantId = plant.tanaman_id;
            const plantName = plant.nama_tanaman;
            const currentDay = plant.hari;
            const remainingDay = plant.masa_panen - currentDay;

            const card = createCard(plantId, plantName, currentDay, remainingDay);
            cardContainer.insertBefore(card, cardContainer.lastElementChild);

            const action = "get_plant_progress";
            response = await fetch(`http://localhost/smart-farm/php/actions.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: action,
                    plantId: plantId,
                }),
            });    
            
            const chartContainer = card.querySelector(".card-chart");
            chartContainer.innerHTML = "";
            if (response.ok) {
                const plantProgress = await response.json();
                createChart(plantProgress, chartContainer, `progress-chart-${plantId}`, false);
            }
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

            const cardChart = c.querySelector(".card-chart");
            cardChart.classList.remove("active");
        });

        const checked = card.querySelector(".checked");
        checked.classList.add("active");

        const cardChart = card.querySelector(".card-chart");
        cardChart.classList.add("active");

        const progressText = document.querySelectorAll(".progress-text");
        progressText.forEach((text) => {
            text.classList.add("active");
        })

        const progressContainer = document.getElementById("progress-container");
        progressContainer.classList.add("active");

        const action = "get_plant_progress";
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
            emptyContainer("progress-card");
            
            const plantProgress = await response.json();

            const progressCard = document.createElement("div");
            progressCard.classList.add("card");
            progressCard.setAttribute("id", "progress-card");
            
            const progressContainer = document.getElementById("progress-container");
            progressContainer.appendChild(progressCard);

            createChart(plantProgress, progressCard, "progress-chart", true);
        }
    }
}

function createChart(plantProgress, container, id, legend) {
    let weeks = [];
    let pupuk_a = [];
    let pupuk_b = [];
    let pupuk_c = [];

    plantProgress.forEach((progress) => {
        weeks.push(parseInt(progress.pekan));
        pupuk_a.push(parseInt(progress.pupuk_a));
        pupuk_b.push(parseInt(progress.pupuk_b));
        pupuk_c.push(parseInt(progress.pupuk_c));
    });

    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", id);

    container.appendChild(canvas);

    const data = {
        labels: weeks,
        datasets: [{
            label: "pupuk_a",
            data: pupuk_a,
            fill: false,
            tension: 0,
            borderColor: "red",
            backgroundColor: "red",
        }, {
            label: "pupuk_b",
            data: pupuk_b,
            fill: false,
            tension: 0,
            borderColor: "green",
            backgroundColor: "green",
        }, {
            label: "pupuk_c",
            data: pupuk_c,
            fill: false,
            tension: 0,
            borderColor: "blue",
            backgroundColor: "blue",
        }]
    }
    
    const config = {
        type: "line",
        data: data,
        options: {
            legend: {
                display: legend,
                labels: {
                    usePointStyle: true,
                }
            },
            scales: {
                yAxes: [{ticks: {min: 0, max: 100}}],
            }
        }
    } 
    
    new Chart(id, config);
}