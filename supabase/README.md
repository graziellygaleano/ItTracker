# Exemplo de conexão com Supabase

O código atual do IT-Tracker usa `localStorage` para usuários e comentários e ainda não lê nem grava no Supabase. Estes arquivos adicionam uma configuração inicial e um exemplo isolado para a tabela `equipamentos`.

1. Copie `.env.example` para `.env` e preencha a URL e a chave **publishable** do projeto Supabase.
2. Execute `npm install` e `npm run dev` na pasta do projeto. Não abra o HTML com `file://`: o Vite precisa carregar o `.env`.
3. No SQL Editor do Supabase, execute `supabase/exemplo.sql`.
4. Veja `js/supabase-exemplo.js` para consultar e inserir equipamentos.

O exemplo SQL permite leitura pública, mas cadastro exige uma sessão do Supabase Auth. O login atual do projeto não é Supabase Auth, então será necessário integrar a autenticação antes de usar a função de cadastro. Configure políticas RLS conforme os dados e os usuários reais do sistema.

O arquivo `.env` é ignorado pelo Git; envie `.env.example` ao repositório. A chave publishable pode aparecer no navegador e deve ser limitada por RLS. Nunca envie ou use uma secret key/service_role no front-end. Se uma chave secreta já foi publicada ou compartilhada, revogue-a e gere outra no painel do Supabase.
