const usuarios = [['Grazy','grazy@gmail.com','22052007'],['Malu','malu@gmail.com','13112004'],['Thales','thales@gmail.com','17022007']]; 

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

export function validarLogin(email,senha){
    console.log("entrou em validar login")

    const usuarioValido = usuarios.some(([ , emailCadastrado, senhaCadastrada]) => 
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


console.log(validarCadastro('grazy','grazy@gmail.com','22052007'))