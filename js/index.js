import { obterStatusLogin, deslogar } from "./gerenciaLogin.js";

document.addEventListener("DOMContentLoaded", () => {

    const estaLogado = obterStatusLogin();
    
    console.log("Status do usuário atualizado na Home:", estaLogado);

    const botaoLogin = document.getElementById('botaoLogin');
    if (botaoLogin) {
        botaoLogin.addEventListener("click", (event) => {
            event.preventDefault(); 
            if (estaLogado === false) {
                window.location.href = "login.html";
            } else {
                window.location.href = "perfil.html";
            }
        });
    }


    const botaoCadastro = document.getElementById('botaoCadastro');
    if (botaoCadastro) {
        botaoCadastro.addEventListener("click", (event) => {
            event.preventDefault(); 
            if (estaLogado === false) {
                window.location.href = "cadastro.html"; 
            } else {
                deslogar()
                window.location.href = "cadastro.html";   
            }
        });
    }


    const botaoPerfil = document.querySelector(".img-perfil")?.parentElement || document.querySelector("a[href='perfil.html']");
    if (botaoPerfil) {
        botaoPerfil.addEventListener("click", (event) => {
            event.preventDefault(); 
            if (estaLogado === false) {
                window.location.href = "login.html";
            } else {

                window.location.href = "perfil.html";
            }
        });
    }
});