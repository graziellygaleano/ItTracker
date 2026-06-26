// js/global.js
import { userDados } from "./gerenciaLogin.js";

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. CONFIGURAÇÃO DO LINK DO FÓRUM GLOBAL
    // ==========================================
    const linkForum = document.getElementById('linkForum');

    if (linkForum) {
        linkForum.addEventListener('click', (event) => {
            event.preventDefault();

            const usuario = userDados();

            if (usuario && usuario.logado === true) {
                window.location.href = "forum.html";
            } else {
                window.location.href = "forumDeslogado.html";
            }
        });
    }

    // ==========================================
    // 2. CONFIGURAÇÃO DO DARK MODE GLOBAL
    // ==========================================
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

    // Aplica o darkmode imediatamente ao carregar a página se estiver ativo
    if (darkmode === "active") {
        enableDarkmode();
    }

    // Gerencia o clique do botão caso ele exista na página atual
    if (trocarModo) {
        trocarModo.addEventListener("click", () => {
            darkmode = localStorage.getItem('darkmode');
            darkmode !== "active" ? enableDarkmode() : disableDarkmode();
        });
    }
});