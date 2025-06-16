document.getElementById("icon-senha").addEventListener("click", function () {
    const senha = document.getElementById("senha");
    const isPassword = senha.getAttribute("type") === "password";

    senha.setAttribute("type", isPassword ? "text" : "password");

    this.src = isPassword ? "./images/olho_aberto.png" : "./images/olho.png";
});

document.getElementById("formulario-login").addEventListener("submit", function (e) {
    // Prevent the default form submission behavior
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (email && senha) {
        alert("Login realizado com sucesso! Redirecionando...");
        window.location.href = '../Agendamento/index.html';
    } else {
        alert("Preencha todos os campos obrigatórios.");
    }
});