import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        ['index', 'equipe', 'forum', 'forumDeslogado', 'cadastro', 'login', 'perfil']
          .map((page) => [page, resolve(projectRoot, `${page}.html`)])
      ),
    },
  },
});
