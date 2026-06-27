const usuarios = [['Grazy','grazy@gmail.com','22052007'],['Malu','malu@gmail.com','13112004'],['Thales','thales@gmail.com','17022007']]; 
if (!localStorage.getItem('bdUsuarios')) {
    localStorage.setItem('bdUsuarios', JSON.stringify(usuarios));
}

export function validarCadastro(nome, email, senha) {

    const usuarioValido = usuarios.some(([nomeCadastrado, emailCadastrado]) => 
        nomeCadastrado === nome && emailCadastrado === email
    );

    if (usuarioValido) {
        console.log("Garantido: Nome e Email encontrados no sistema!");
        return true;
    }

    console.log("Usuário não encontrado com esses dados.");
    return false;
}

export function validarLogin(email, senha) {
    console.log("entrou em validar login");

    const listaUsuarios = JSON.parse(localStorage.getItem('bdUsuarios')) || [];

    const usuarioValido = listaUsuarios.some(([ , emailCadastrado, senhaCadastrada]) => 
        emailCadastrado === email && senhaCadastrada === senha
    );

    if (usuarioValido) {
        console.log("Garantido: As credenciais batem perfeitamente!");
        return true;
    }

    console.log("Usuário ou senha incorretos.");
    return false;
}

export function salvarUsuario(nome,email,senha) {
    const novoUser = []
    
    novoUser.push(nome)
    novoUser.push(email)
    novoUser.push(senha)

    usuarios.push(novoUser)

    localStorage.setItem('bdUsuarios',JSON.stringify(usuarios))

}


export function excluirUser(nome) {
    console.log('entrou em excluir')
    const listaUsuarios = JSON.parse(localStorage.getItem('bdUsuarios')) || [];


    const listaAtualizada = listaUsuarios.filter(sublista => {
        return sublista[0] !== nome;
    });

    localStorage.setItem('bdUsuarios', JSON.stringify(listaAtualizada));
}

export function buscarUsuarioPorEmail(emailParaBuscar) {
    const listaUsuarios = JSON.parse(localStorage.getItem('bdUsuarios')) || [];

    const usuarioEncontrado = listaUsuarios.find(sublista => {
        return sublista[1] === emailParaBuscar;
    });

    if (usuarioEncontrado) {
        return {
            nome: usuarioEncontrado[0],
            email: usuarioEncontrado[1],
            senha: usuarioEncontrado[2]
        };
    }

    return null;
}

export function atualizarPerfil(emailAntigo) {
    const campoNome = document.getElementById('nomeCampo');
    const campoEmail = document.getElementById('emailCampo');
    const campoSenha = document.getElementById('senhaCampo');

    if (!campoNome || !campoEmail || !campoSenha) return;

    const novoNome = campoNome.value;
    const novoEmail = campoEmail.value;
    const novaSenha = campoSenha.value;

    const usuarioLogadoAtualizado = {
        nome: novoNome,
        email: novoEmail,
        senha: novaSenha,
        logado: true
    };
    localStorage.setItem('userLogado', JSON.stringify(usuarioLogadoAtualizado));

    const listaUsuarios = JSON.parse(localStorage.getItem('bdUsuarios')) || [];

    const listaAtualizada = listaUsuarios.map(sublista => {
    console.log('Entrou nessa func')
        if (sublista[1] === emailAntigo) {
            return [novoNome, novoEmail, novaSenha]; 
        }
        return sublista; 
    });
    localStorage.setItem('bdUsuarios', JSON.stringify(listaAtualizada));

    window.location.reload(); 
}