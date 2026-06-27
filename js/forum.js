import { userDados } from "./gerenciaLogin.js";

document.addEventListener("DOMContentLoaded", () => {
    const autorPergunta = document.getElementById('autor-pergunta');
    const campoPergunta = document.getElementById('campo-pergunta');
    const botaoPublicar = document.getElementById('botaoPublicar');
    const containerComentarios = document.getElementById('container-comentarios');

    const dadosUsuario = userDados();
    const estaLogado = dadosUsuario !== false;

    if (dadosUsuario && autorPergunta) {
        autorPergunta.innerText = dadosUsuario.nome;
    } else if (autorPergunta) {
        autorPergunta.innerText = "Visitante Anônimo";
    }

    function renderizarCard(textoDoComentario, nomeDoAutor, respostaTexto = null, respostaAutor = null, respondida = false) {
        const novoCard = document.createElement('div');
        novoCard.className = "col-12 col-md-6 card-forum-item-container";
        novoCard.setAttribute('data-respondida', respondida);

        const donoDoCard = dadosUsuario && dadosUsuario.nome === nomeDoAutor;

        let htmlCard = `
        <div class="bloco-pergunta d-flex flex-column justify-content-between p-4 h-100">
            <div>
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="autor-pergunta" style="color: var(--amarelo); font-weight: bold;">${nomeDoAutor}</h5>
                    
                    ${donoDoCard ? `
                        <button class="btn-remover-comentario" style="background: none; border: none; color: #ff4d4d; font-size: 0.85rem; cursor: pointer; font-weight: bold;">
                            ✕ Excluir
                        </button>
                    ` : ''}
                </div>
                <p class="texto-comentario-publicado mt-2" style="white-space: pre-wrap;">${textoDoComentario}</p>
            </div>
    `;

        if (respondida && respostaTexto) {
            htmlCard += `
            <div class="resposta-pergunta mt-3">
                <h6 class="nome-resposta">${respostaAutor}</h6>
                <p class="texto-pergunta" style="white-space: pre-wrap;">${respostaTexto}</p>
            </div>
        `;
        } else if (estaLogado) {
            htmlCard += `
            <div class="area-resposta-privada mt-3">
                <button class="btn-abrir-resposta" style="background: none; border: none; color: var(--azul, #007bff); cursor: pointer; padding: 0; font-weight: bold; font-size: 0.9rem;">
                    ↳ Responder
                </button>
                
                <div class="formulario-resposta mt-2" style="display: none;">
                    <textarea class="campo-resposta-interna campo-pergunta" placeholder="Escreva uma resposta..." style="width: 100%; min-height: 70px; border-radius: 8px; padding: 10px; font-size: 0.95rem;"></textarea>
                    <div class="text-end login-submit mt-2">
                        <button class="btn-enviar-resposta botao-publicar" style="padding: 5px 20px; font-size: 0.85rem;">Enviar</button>
                    </div>
                </div>
            </div>
        `;
        }
        htmlCard += `</div>`;

        novoCard.innerHTML = htmlCard;

        if (donoDoCard) {
            const btnRemover = novoCard.querySelector('.btn-remover-comentario');
            btnRemover.addEventListener('click', () => {
                const confirmar = confirm("Tem certeza que deseja apagar a sua pergunta permanentemente?");
                if (confirmar) {
                    let comentariosSalvos = JSON.parse(localStorage.getItem('bdComentarios')) || [];

                    comentariosSalvos = comentariosSalvos.filter(c => !(c.texto === textoDoComentario && c.autor === nomeDoAutor));

                    localStorage.setItem('bdComentarios', JSON.stringify(comentariosSalvos));

                    window.location.reload();
                }
            });
        }

        if (!respondida && estaLogado) {
            const btnAbrir = novoCard.querySelector('.btn-abrir-resposta');
            const formResposta = novoCard.querySelector('.formulario-resposta');
            const btnEnviar = novoCard.querySelector('.btn-enviar-resposta');
            const campoRespostaInterna = novoCard.querySelector('.campo-resposta-interna');

            btnAbrir.addEventListener('click', () => {
                formResposta.style.display = formResposta.style.display === "none" ? "block" : "none";
            });

            btnEnviar.addEventListener('click', () => {
                const textoResposta = campoRespostaInterna.value.trim();
                if (textoResposta === "") {
                    alert("A resposta não pode estar vazia!");
                    return;
                }

                const nomeQuemRespondeu = dadosUsuario ? dadosUsuario.nome : "Usuário Logado";
                const comentariosSalvos = JSON.parse(localStorage.getItem('bdComentarios')) || [];
                const index = comentariosSalvos.findIndex(c => c.texto === textoDoComentario && c.autor === nomeDoAutor);

                if (index !== -1) {
                    comentariosSalvos[index].respostaTexto = textoResposta;
                    comentariosSalvos[index].respostaAutor = nomeQuemRespondeu;
                    comentariosSalvos[index].respondida = true;
                    localStorage.setItem('bdComentarios', JSON.stringify(comentariosSalvos));
                }

                window.location.reload();
            });
        }

        containerComentarios.appendChild(novoCard);
    }

    const comentariosSalvos = JSON.parse(localStorage.getItem('bdComentarios')) || [];
    comentariosSalvos.forEach(c => renderizarCard(c.texto, c.autor, c.respostaTexto, c.respostaAutor, c.respondida || false));

    if (botaoPublicar) {
        botaoPublicar.addEventListener('click', (event) => {
            event.preventDefault();

            const textoDigitado = campoPergunta.value.trim();
            const nomeAutor = dadosUsuario ? dadosUsuario.nome : "Visitante Anônimo";

            if (textoDigitado === "") {
                alert("Por favor, escreva sua dúvida antes de publicar!");
                return;
            }

            renderizarCard(textoDigitado, nomeAutor, null, null, false);

            comentariosSalvos.push({
                texto: textoDigitado,
                autor: nomeAutor,
                respostaTexto: null,
                respostaAutor: null,
                respondida: false 
            });
            localStorage.setItem('bdComentarios', JSON.stringify(comentariosSalvos));

            campoPergunta.value = "";
        });
    }
});