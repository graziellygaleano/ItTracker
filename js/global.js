// js/global.js
import { userDados } from "./gerenciaLogin.js";

document.addEventListener("DOMContentLoaded", () => {
    
    const linksDoForum = document.querySelectorAll('a[href="forum.html"]');
    const usuario = userDados();

    linksDoForum.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            if (usuario && usuario.logado === true) {
                window.location.href = "forum.html";
            } else {
                window.location.href = "forumDeslogado.html";
            }
        });
    });

    let darkmode = localStorage.getItem('darkmode');
    const trocarModo = document.getElementById('trocar-modo');

    const enableDarkmode = () => {
        document.body.classList.add('darkmode');
        localStorage.setItem('darkmode', 'active');
    };

    const disableDarkmode = () => {
        document.body.classList.remove('darkmode');
        localStorage.setItem('darkmode', null);
    };

    if (darkmode === "active") {
        enableDarkmode();
    }

    if (trocarModo) {
        trocarModo.addEventListener("click", () => {
            darkmode = localStorage.getItem('darkmode');
            darkmode !== "active" ? enableDarkmode() : disableDarkmode();
        });
    }
});