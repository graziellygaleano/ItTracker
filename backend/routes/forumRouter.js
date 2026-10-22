import { Router } from 'express';
import { forumController } from '../controllers/forumController.js';

const router = Router();

// Pesquisa Global
router.get('/search', forumController.pesquisaGlobal);

// Operações sobre Comentários
router.post('/comments', forumController.criarComentario);
router.delete('/comments/:postId', forumController.removerComentario);
router.post('/comments/:postId/tags', forumController.associarTag);
router.delete('/comments/:postId/tags/:tagId', forumController.desassociarTag);
router.get('/comments/:postId/replies', forumController.listarRespostas);

// Operações sobre Etiquetas (Tags)
router.get('/tags/exists', forumController.verificarTag);
router.post('/tags', forumController.criarTag);
router.delete('/tags/:tagId', forumController.removerTag);

export default router;