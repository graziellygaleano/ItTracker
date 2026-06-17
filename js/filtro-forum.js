const filtroForum = document.querySelector('.filtro-forum');
const headerOpcao = document.getElementById('header-opcao');
const opcoesRadio = document.querySelectorAll('.opcoes-expansivel');


headerOpcao.addEventListener('click', (event) => {
  event.stopPropagation(); 
  filtroForum.classList.toggle('open');
});

opcoesRadio.forEach(radio => {
  radio.addEventListener('change', (event) => {
    const labelTexto = document.querySelector(`label[for="${event.target.id}"]`).textContent;
    
    headerOpcao.textContent = labelTexto;
    
    filtroForum.classList.remove('open');
  });
});

window.addEventListener('click', () => {
  filtroForum.classList.remove('open');
});