document.addEventListener("DOMContentLoaded", () => {
    const filtroForum = document.querySelector('.filtro-forum');
    const headerOpcao = document.getElementById('header-opcao');
    const opcoesRadio = document.querySelectorAll('.opcoes-expansivel');

    function aplicarFiltroVisual(idSelecionado) {
        const container = document.getElementById('container-comentarios');
        if (!container) return;
        
        const todosOsCards = container.querySelectorAll('.bloco-pergunta');

        todosOsCards.forEach(card => {
            const attr = card.getAttribute('data-respondida');
            
            if (!attr) return;

            const statusRespondida = attr.trim() === 'true';

            if (idSelecionado === 'todas-perguntas') {
                card.style.setProperty('display', 'flex', 'important'); 
            } 
            else if (idSelecionado === 'perguntas-respondidas') {
                if (statusRespondida) {
                    card.style.setProperty('display', 'flex', 'important');
                } else {
                    card.style.setProperty('display', 'none', 'important');
                }
            } 
            else if (idSelecionado === 'perguntas-naoRespondidas') {
                if (!statusRespondida) {
                    card.style.setProperty('display', 'flex', 'important');
                } else {
                    card.style.setProperty('display', 'none', 'important');
                }
            }
        });
    }

    if (headerOpcao) {
        headerOpcao.addEventListener('click', (event) => {
            event.stopPropagation(); 
            filtroForum.classList.toggle('open');
        });
    }

    opcoesRadio.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const labelTexto = document.querySelector(`label[for="${event.target.id}"]`).textContent;
            headerOpcao.textContent = labelTexto;
            filtroForum.classList.remove('open');

            aplicarFiltroVisual(event.target.id);
        });
    });

    window.addEventListener('click', () => {
        if (filtroForum) filtroForum.classList.remove('open');
    });

    setTimeout(() => {
        const radioAtivo = document.querySelector('.opcoes-expansivel:checked');
        if (radioAtivo) aplicarFiltroVisual(radioAtivo.id);
    }, 100); 
});