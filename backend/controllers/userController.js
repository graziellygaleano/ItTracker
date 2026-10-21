

import { UserService } from '../service/userService.js';
import { AppError } from '../middlewares/appError.js';

export const userController = {
  async cadastrar(req, res, next) {
    try {
      const { username, email, senha } = req.body;

      if (!username || !email || !senha) {
        throw new AppError('Nome de usuário, e-mail e senha são obrigatórios.', 400);
      }

      await UserService.register(req.body);

      res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.' });
    } catch (erro) {
      next(erro);
    }
  },

  async autenticar(req, res, next) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        throw new AppError('Informe o e-mail e a senha para efetuar o login.', 400);
      }

      const autenticado = await UserService.autentication(req.body);

      if (!autenticado) {
        throw new AppError('Credenciais inválidas. Verifique os dados informados.', 401);
      }

      res.status(200).json({
        autenticado: true,
        mensagem: 'Login realizado com sucesso.'
      });
    } catch (erro) {
      next(erro);
    }
  },

  async logout(req, res, next) {
    try {
      await UserService.logOut();
      res.status(200).json({ mensagem: 'Sessão encerrada com sucesso.' });
    } catch (erro) {
      next(erro);
    }
  },

  async validarUsername(req, res, next) {
    try {
      const { info, data } = req.body;

      if (!info) {
        throw new AppError('Informe o nome de usuário a ser validado.', 400);
      }

      await UserService.authUsername(info, data);
      res.status(200).json({
        valido: true,
        mensagem: 'Nome de usuário disponível para uso.'
      });
    } catch (erro) {
      next(erro);
    }
  },

  async obterUsuario(req, res, next) {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        throw new AppError('O identificador do usuário informado é inválido.', 400);
      }

      const usuario = await UserService.getUser(Number(id));

      if (!usuario) {
        throw new AppError('Usuário não encontrado.', 404);
      }

      res.status(200).json(usuario);
    } catch (erro) {
      next(erro);
    }
  },

  async atualizarPerfil(req, res, next) {
    try {
      const { id } = req.params;
      const { field, newValue } = req.body;

      if (!field || newValue === undefined) {
        throw new AppError('Campo e novo valor devem ser fornecidos para atualização.', 400);
      }

      await UserService.updateProfile(id, field, newValue);
      res.status(200).json({ mensagem: 'Perfil atualizado com sucesso.' });
    } catch (erro) {
      next(erro);
    }
  },

  async deletarUsuario(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError('O identificador do usuário é obrigatório.', 400);
      }

      await UserService.deleteUser(id);
      res.status(200).json({ mensagem: 'Conta de usuário excluída com sucesso.' });
    } catch (erro) {
      next(erro);
    }
  }
};