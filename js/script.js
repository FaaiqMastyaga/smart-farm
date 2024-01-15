document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menu");
    const plusCard = document.getElementById("plus-card");
    const plantContainer = document.getElementById("plant-container");

    menuButton.addEventListener("click", activateSideBar);
    plusCard.addEventListener("click", addCard);

    plantContainer.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("delete-button")) {
            deleteCard(target.closest(".card"));
        }
    });
})

function activateSideBar() {
    const sidebar = document.querySelector('.sidebar');
    const section = document.querySelector('.section');
    sidebar.classList.toggle('active');
    section.classList.toggle('shrink');
}

function addCard() {
    const cardContainer = document.getElementById("plant-container");
    const plantName = prompt("Insert plant: ");
    
    if (plantName) {
        const card = createCard(plantName);
        cardContainer.insertBefore(card, cardContainer.lastElementChild);
    }
}

function createCard(plantName) {
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
            <a href="#" class="delete-button">
                <i class="fa fa-trash"></i>
            </a>
        </div>
        <div class="card-info">
            <p>Hari ke 2</p>
        </div>
        <div class="card-image">

        </div>
    `    
    return card;
}

function deleteCard(card) {
    const confirmation = confirm("Are you sure you want to delete this?");

    if (confirmation) {
        card.remove();
    }
}