import { validarCadastro, validarLogin, salvarUsuario} from "./crudUser.js"

const forms = document.getElementById('formulario')

if (forms) {
    forms.addEventListener('submit', function (event){
        event.preventDefault()

        const dadosForms = new FormData(forms)

        let email =  dadosForms.get('email')
        let nome =  dadosForms.get('nome')
        let senha =  dadosForms.get('senha')

        const validacao = validarCadastro(nome, email, senha)

        if (validacao == true) {
            const modalErro = new bootstrap.Modal(document.getElementById('modalErroCadastro'));
            modalErro.show();
        }
        else {
            salvarUsuario(nome, email, senha)
            
            const modalSucesso = new bootstrap.Modal(document.getElementById('modalSucessoCadastro'));
            modalSucesso.show();

            const btnSucessoOk = document.getElementById('btnSucessoOk');
            if (btnSucessoOk) {
                btnSucessoOk.addEventListener('click', () => {
                    window.location.replace("perfil.html");
                });
            }
        }
    });
}