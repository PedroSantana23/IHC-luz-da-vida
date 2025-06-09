const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');     // abre/fecha menu
    menuToggle.classList.toggle('open');  // anima ícone (se quiser)
});