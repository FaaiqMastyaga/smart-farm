document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menu");
    const plusCard = document.getElementById("plus-card");

    menuButton.addEventListener("click", activateSideBar);
    plusCard.addEventListener("click", addCard);
})

function activateSideBar() {
    const sidebar = document.querySelector('.sidebar');
    const section = document.querySelector('.section');
    sidebar.classList.toggle('active');
    section.classList.toggle('shrink');
}

function addCard() {
    const cardContainer = document.querySelector(".card-container");
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("id", "plant-card");
    cardContainer.insertBefore(card, cardContainer.lastElementChild);
}