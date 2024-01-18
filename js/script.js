document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menu");

    menuButton.addEventListener("click", activateSideBar);
})

function activateSideBar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("active");
    
    const section = document.querySelector(".section");
    section.classList.toggle("shrink");
}

function closeBox(box) {
    const confirmationBox = box;
    const barrier = document.querySelector(".barrier");
    const content = document.querySelector(".wrapper")

    confirmationBox.classList.remove("active");
    barrier.classList.remove("active");
    content.classList.remove("dark");
}

function emptyContainer(id) {
    const cards = document.querySelectorAll(`#${id}`);
    cards.forEach((c) => {
        c.remove();
    })
}