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