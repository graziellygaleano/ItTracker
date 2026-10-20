import { Router } from 'express';
import { userController } from '../controllers/userController.js';

const router = Router();

router.post('/register', userController.cadastrar);

router.post('/login', userController.autenticar);
router.post('/logout', userController.logout);

router.post('/check-username', userController.validarUsername);
router.get('/:id', userController.obterUsuario);
router.patch('/:id/profile', userController.atualizarPerfil);
router.delete('/:id', userController.deletarUsuario);

export default router;