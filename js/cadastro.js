import { validarCadastro, validarLogin, salvarUsuario} from "./salvarUser.js"

const forms = document.getElementById('formulario')

forms.addEventListener('submit', function (event){

    event.preventDefault()

    const dadosForms = new FormData(forms)

    let email =  dadosForms.get('email')
    let nome =  dadosForms.get('nome')
    let senha =  dadosForms.get('senha')

    const validacao = validarCadastro(nome, email, senha)

    if (validacao == true) {
        alert('Usuário já cadastrado! Tente fazer o login')
    }
    else {
        salvarUsuario(nome,email,senha)
        alert("Usuário cadastrado com sucesso!")
        window.location.replace("perfil.html");
        
    }

})


