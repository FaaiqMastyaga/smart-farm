const sidebar = document.querySelector(".sidebar");

document.querySelector('#menu').onclick = () => {
    sidebar.classList.toggle('active');
}