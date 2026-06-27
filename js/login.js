import { validarLogin, buscarUsuarioPorEmail } from "./crudUser.js"
import { logar } from './gerenciaLogin.js'

let userConectado = JSON.parse(localStorage.getItem('userLogado')) || false;

const forms = document.getElementById('formulario');

if (forms) {
    forms.addEventListener('submit', function (event) {
        console.log("entrou em login");
        event.preventDefault();

        const dadosForms = new FormData(forms);
        let email = dadosForms.get('email');
        let senha = dadosForms.get('senha');

        const validacao = validarLogin(email, senha);

        if (validacao === true) {
            const dadosCompletos = buscarUsuarioPorEmail(email);
            const nomeApenas = dadosCompletos ? dadosCompletos.nome : "Usuário";

            const user = { nome: nomeApenas, email: email, senha: senha, logado: true };
            
            localStorage.setItem('userLogado', JSON.stringify(user));

            window.location.replace("perfil.html"); 
            
        } else {
            const modalErro = new bootstrap.Modal(document.getElementById('modalErroLogin'));
            modalErro.show();
        }
    }); 
}