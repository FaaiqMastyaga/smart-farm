document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menu");

    menuButton.addEventListener("click", activateSideBar);
})

function activateSideBar() {
    const sidebar = document.querySelector('.sidebar');
    const section = document.querySelector('.section');
    sidebar.classList.toggle('active');
    section.classList.toggle('shrink');
}

fu