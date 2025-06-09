document.getElementById("togglePassword").addEventListener("click", function () {
  const senha = document.getElementById("senha");
  const isPassword = senha.getAttribute("type") === "password";
 
  senha.setAttribute("type", isPassword ? "text" : "password");

  // Alterna a imagem
  this.src = isPassword ? "olho.png" : "olho2.png";
});

 
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    if (email && senha) {
      alert("Login realizado com sucesso!");
    } else {
      alert("Preencha todos os campos obrigatórios.");
    }
  });
