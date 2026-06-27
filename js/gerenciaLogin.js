export function obterStatusLogin() {
    const user = JSON.parse(localStorage.getItem('userLogado'));
    return user ? user.logado : false;
}

export function userDados() {
    const user = JSON.parse(localStorage.getItem('userLogado'));

    return user ? user : false;
}

export function logar() {
    console.log('Conectou user');
    localStorage.setItem('userConectado', JSON.stringify(true));
}

export function deslogar() {
    console.log('Desconectou user');
    localStorage.setItem('userConectado', JSON.stringify(false));
    localStorage.removeItem('userLogado');
    window.location.replace("index.html");
}