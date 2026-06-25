import { deslogar } from "./gerenciaLogin.js";

const botaoSair = document.getElementById('botaoSair'); 

if (botaoSair) {
    
    botaoSair.addEventListener('click', (event) => {
        event.preventDefault();
        console.log("Botão Sair clicado, chamando função deslogar...");
        deslogar(); 
    });
}