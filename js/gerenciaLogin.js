
let userConectado = JSON.parse(localStorage.getItem('userConectado')) || false;

document.addEventListener("DOMContentLoaded", () => {

    const botaoPerfil = document.querySelector(".nav-link-perfil") || document.querySelector("a[href='perfil.html']");

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

export function logar() {
    userConectado = true;
    console.log('Conectou user');
    localStorage.setItem('userConectado', JSON.stringify(userConectado));
}

export function deslogar() {
    userConectado = false;
    console.log('Desconectou user');
    localStorage.setItem('userConectado', JSON.stringify(userConectado));
    alert("Usuário desconectado com sucesso!")
    
}