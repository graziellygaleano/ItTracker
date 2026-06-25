export function obterStatusLogin() {
    return JSON.parse(localStorage.getItem('userConectado')) || false;
}

export function logar() {
    console.log('Conectou user');
    localStorage.setItem('userConectado', JSON.stringify(true));
}

export function deslogar() {
    console.log('Desconectou user');
    localStorage.setItem('userConectado', JSON.stringify(false));
    alert("Usuário desconectado com sucesso!");
    window.location.replace("index.html");
}