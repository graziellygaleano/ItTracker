import { ForumService } from '../services/forumService.js';
import { AppError } from '../utils/AppError.js';

export const forumController = {
  async pesquisaGlobal(req, res, next) {
    try {
      const { q, tagId } = req.query;

      // Executa a busca global passando os filtros opcionais
      const resultado = await ForumService.globalSearch(q || '', { tagId });

      const dados = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;
      
      res.status(200).json(dados);
    } catch (erro) {
      next(erro);
    }
  },

  async criarComentario(req, res, next) {
    try {
      const { authorId, content } = req.body;

      if (!authorId || !content) {
        throw new AppError('O identificador do autor e o conteúdo são obrigatórios.', 400);
      }

      await ForumService.createComment(Number(authorId), content);
      res.status(201).json({ mensagem: 'Comentário publicado com sucesso.' });
    } catch (erro) {
      next(erro);
    }
  },

  async removerComentario(req, res, next) {
    try {
      const { postId } = req.params;

      if (!postId) {
        throw new AppError('ID do comentário é obrigatório.', 400);
      }

      await ForumService.deleteComment(Number(postId));
      res.status(200).json({ mensagem: 'Comentário removido com sucesso.' });
    } catch (erro) {
      next(erro);
    }
  },

  async associarTag(req, res, next) {
    try {
      const { postId } = req.params;
      const { tagId } = req.body;

      if (!tagId) {
        throw new AppError('O ID da tag é obrigatório no corpo da requisição.', 400);
      }

      await ForumService.addTagToComment(Number(postId), Number(tagId));
      res.status(201).json({ mensagem: 'Tag associada ao comentário com sucesso.' });
    } catch (erro) {
      next(erro);
    }
  },

  async desassociarTag(req, res, next) {
    try {
      const { postId, tagId } = req.params;

      await ForumService.removeTagFromComment(Number(postId), Number(tagId));
      res.status(200).json({ mensagem: 'Tag desvinculada do comentário com sucesso.' });
    } catch (erro) {
      next(erro);
    }
  },

  async verificarTag(req, res, next) {
    try {
      const { tagName } = req.query;

      if (!tagName) {
        throw new AppError('Informe o parâmetro tagName na query da requisição.', 400);
      }

      const existe = await ForumService.tagExists(tagName);
      res.status(200).json({ existe });
    } catch (erro) {
      next(erro);
    }
  },

  async criarTag(req, res, next) {
    try {
      const { tagName } = req.body;

      if (!tagName || !tagName.trim()) {
        throw new AppError('O nome da tag é obrigatório.', 400);
      }

      await ForumService.createTag(tagName.trim());
      res.status(201).json({ mensagem: 'Tag criada com sucesso.' });
    } catch (erro) {
      next(erro);
    }
  },

  async removerTag(req, res, next) {
    try {
      const { tagId } = req.params;

      if (!tagId) {
        throw new AppError('ID da tag não informado.', 400);
      }

      await ForumService.deleteTag(Number(tagId));
      res.status(200).json({ mensagem: 'Tag excluída com sucesso.' });
    } catch (erro) {
      next(erro);
    }
  }
};
