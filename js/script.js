export { activateSideBar };

function activateSideBar() {
    const sidebar = document.querySelector('.sidebar');
    const section = document.querySelector('.section');
    document.querySelector('#menu').onclick = () => {
        sidebar.classList.toggle('active');
        section.classList.toggle('shrink');
    }
}