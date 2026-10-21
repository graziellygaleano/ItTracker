import DAO from '../repositories/DAO.js';
import Tag from '../models/Tag.js';
import Comment from '../models/Comment.js';
import { AppError } from '../utils/AppError.js';

const db = new DAO();

export class ForumService {
  static async createComment(authorId, content, rootPostId = null) {
    if (!content || !content.trim()) {
      throw new AppError('O conteúdo do comentário não pode estar vazio.', 400);
    }

    const isRoot = !rootPostId;
    const parentId = rootPostId ? Number(rootPostId) : null;

    if (parentId) {
      const parentCheck = await db.queryExecutor(
        'SELECT id FROM comentarios WHERE id = $1',
        [parentId]
      );

      if (!parentCheck || parentCheck.length === 0) {
        throw new AppError('O comentário pai informado não existe.', 404);
      }
    }

    // Instancia o modelo Comment
    const novoComentario = new Comment(
      isRoot,                  
      null,                    
      Number(authorId),        
      content.trim(),         
      new Date().toISOString(), 
      false,                  
      parentId                
    );

    const queryInsert = `
      INSERT INTO comentarios (comment_type, author_id, content, comment_date, has_replys, root_post_id) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const resultado = await db.queryExecutor(queryInsert, [
      novoComentario.commentType,
      novoComentario.authorId,
      novoComentario.content,
      novoComentario.commentDate,
      novoComentario.hasReplys,
      novoComentario.rootPostID
    ]);

    if (parentId) {
      await db.queryExecutor(
        'UPDATE comentarios SET has_replys = true WHERE id = $1',
        [parentId]
      );
    }

    return resultado[0];
  }
}