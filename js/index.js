document.addEventListener("DOMContentLoaded", () => {

    const botaLogin = document.querySelector(".nav-link-perfil") || document.querySelector("a[href='perfil.html']");

    if (botaoPerfil) {
        botaoPerfil.addEventListener("click", (event) => {
            event.preventDefault(); 


            if (userConectado === false) {
                window.location.href = "login.html";
            } else {
                window.location.href = "perfil.html";
            }
        });
    }
});
