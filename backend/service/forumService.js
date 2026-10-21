import DAO from '../repositories/dao.js';
import Tag from '../models/tag.js';
import Comment from '../models/comment.js';
import CrudComment from '../repositories/crudComment.js';
import CrudTag from '../repositories/crudTag.js';
import { AppError } from '../middlewares/appError.js';

const db = new DAO();
const crudComment = new CrudComment(db);
const crudTag = new CrudTag(db);

export class ForumService {
  static async createComment(authorId, content, rootPostId = null) {
    if (!content || !content.trim()) {
      throw new AppError('O conteúdo do comentário não pode estar vazio.', 400);
    }

    const commentType = rootPostId ? "resposta" : "post";
    const parentId = rootPostId ? Number(rootPostId) : null;

    if (parentId) {
      const parentCheck = await crudComment.findById(parentId, "post");
      if (!parentCheck) {
        throw new AppError('O post pai informado não existe.', 404);
      }
    }

    const novoComentario = new Comment(
      commentType,                  
      null,                    
      Number(authorId),        
      content.trim(),         
      new Date().toISOString(), 
      false,                  
      parentId                
    );

    const idInserido = await crudComment.createComment(novoComentario);
    return { id: idInserido };
  }

  static async getCommentById(id, type = "post") {
    if (!id) {
      throw new AppError('O ID do post/resposta é obrigatório.', 400);
    }

    const comment = await crudComment.findById(Number(id), type);
    if (!comment) {
      throw new AppError('Postagem não encontrada.', 404);
    }

    return comment;
  }

  static async getAllRootPosts() {
    return await crudComment.findAll();
  }

  static async getReplies(rootPostId) {
    if (!rootPostId) {
      throw new AppError('O ID da postagem pai é obrigatório.', 400);
    }

    return await crudComment.getReply(Number(rootPostId));
  }

  static async deleteComment(id, type = "post") {
    if (!id) {
      throw new AppError('O ID do post/resposta é obrigatório.', 400);
    }

    const result = await crudComment.deleteById(Number(id), type);
    if (result === 0) {
      throw new AppError('Falha ao excluir. Postagem pode não existir.', 404);
    }
    return true;
  }

  static async addTagToComment(postId, tagId) {
    if (!postId || !tagId) {
      throw new AppError('O ID do post e o ID da Tag são obrigatórios.', 400);
    }

    await db.queryExecutor(
      'INSERT INTO public."FiltroTags" ("Post_idPost", "Tags_idTag") VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [Number(postId), Number(tagId)]
    );

    return { postId, tagId };
  }

  static async tagExists(tagName) {
    const tagsEncontradas = await crudTag.findByName(tagName.trim());
    return tagsEncontradas.length > 0;
  }

  static async createTag(tagName) {
    const novaTag = new Tag(tagName.trim(), null);
    const idInserido = await crudTag.createTag(novaTag);
    return { id: idInserido, name: tagName };
  }

  static async deleteTag(tagId) {
    await crudTag.deleteById(Number(tagId));
  }

  static async globalSearch(q, filters) {
    return { mensagem: 'Endpoint de busca global alcançado', query: q };
  }
}

export default ForumService;