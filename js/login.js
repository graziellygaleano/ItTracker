import { validarLogin } from "./salvarUser.js"
import { logar } from './gerenciaLogin.js'

// --- CORREÇÃO 1: Inicializar a variável buscando do localStorage ---
// Se houver algo salvo lá, ele converte para booleano. Se não houver nada, assume false.
let userConectado = JSON.parse(localStorage.getItem('userConectado')) || false;

const forms = document.getElementById('formulario');

// Segurança: Só adiciona o evento do formulário se ele existir na página atual (evita erros na página de perfil)
if (forms) {
    forms.addEventListener('submit', function (event){
        console.log("entrou em login");
        event.preventDefault();

        const dadosForms = new FormData(forms);
        let email = dadosForms.get('email');
        let senha = dadosForms.get('senha');

        const validacao = validarLogin(email, senha);

        if (validacao === true) {
            logar(); 
            window.location.replace("perfil.html");
        } else {
            alert("Email ou senha incorreto!");
        }
    });
}

