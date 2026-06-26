import { deslogar, userDados } from "./gerenciaLogin.js";
import { buscarUsuarioPorEmail, excluirUser, atualizarPerfil } from "./crudUser.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Página de perfil carregada com sucesso!");

    const botaoSair = document.getElementById('botaoSair');
    const botaoExcluirC = document.getElementById('botaoExcluir');

    const mensagemBoasVindas = document.getElementById('titulo-comentario');
    const nomeUserTop = document.getElementById('nomePerfil');
    const emailUserTop = document.getElementById('emailPerfil');
    const campoNome = document.getElementById('nomeCampo');
    const campoEmail = document.getElementById('emailCampo');
    const campoSenha = document.getElementById('senhaCampo');

    const dados = userDados();

    if (dados && dados.logado === true) {
        if (mensagemBoasVindas) mensagemBoasVindas.innerText = `Bem-vinda de volta, ${dados.nome}!`;
        if (nomeUserTop) nomeUserTop.innerText = dados.nome;
        if (emailUserTop) emailUserTop.innerText = dados.email;
        if (campoNome) campoNome.value = dados.nome;
        if (campoEmail) campoEmail.value = dados.email;
        if (campoSenha) campoSenha.value = dados.senha;
    } else {
        window.location.href = "login.html";
    }

    if (botaoSair) {
        botaoSair.addEventListener('click', (event) => {
            event.preventDefault();
            deslogar();
        });
    }

    if (botaoExcluirC) {
        botaoExcluirC.addEventListener('click', (event) => {
            event.preventDefault();

            if (dados && dados.nome) {
                const confirmar = confirm("Tem certeza que deseja excluir sua conta permanentemente?");
                if (confirmar) {
                    excluirUser(dados.nome);
                    console.log(buscarUsuarioPorEmail('grazy1@gmail.com'))
                    deslogar();
                }
            }
        });
    }

    const botaoLogin = document.getElementById('botaoLogin');
    if (botaoLogin) {
        botaoLogin.addEventListener("click", (event) => {
            event.preventDefault();
            if (!dados || dados.logado === false) {
                window.location.href = "login.html";
            } else {
                window.location.href = "perfil.html";
            }
        });
    }

    const botaoSalvar = document.getElementById('botaoSalvar');

    if (botaoSalvar && dados) {
        botaoSalvar.addEventListener('click', (event) => {
            event.preventDefault();
            atualizarPerfil(dados.email);
        });
    }
});