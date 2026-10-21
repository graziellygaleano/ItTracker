import DAO from '../repositories/dao.js';
import Tag from '../models/tag.js';
import Comment from '../models/comment.js';
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

  static async getCommentById(id) {
    if (!id) {
      throw new AppError('O ID do comentário é obrigatório.', 400);
    }

    const rows = await db.queryExecutor(
      'SELECT * FROM comentarios WHERE id = $1',
      [Number(id)]
    );

    if (rows.length === 0) {
      throw new AppError('Comentário não encontrado.', 404);
    }

    const c = rows[0];
    return new Comment(
      c.root_post_id === null, 
      c.id,
      c.author_id,
      c.content,
      c.comment_date,
      c.has_replys,
      c.root_post_id
    );
  }

  static async getAllRootPosts() {
    const rows = await db.queryExecutor(
      'SELECT * FROM comentarios WHERE root_post_id IS NULL ORDER BY comment_date DESC'
    );

    return rows.map(c => new Comment(
      true,
      c.id,
      c.author_id,
      c.content,
      c.comment_date,
      c.has_replys,
      c.root_post_id
    ));
  }

  static async getReplies(rootPostId) {
    if (!rootPostId) {
      throw new AppError('O ID da postagem pai é obrigatório.', 400);
    }

    const rows = await db.queryExecutor(
      'SELECT * FROM comentarios WHERE root_post_id = $1 ORDER BY comment_date ASC',
      [Number(rootPostId)]
    );

    return rows.map(c => new Comment(
      false, 
      c.id,
      c.author_id,
      c.content,
      c.comment_date,
      c.has_replys,
      c.root_post_id
    ));
  }

  static async deleteComment(id) {
    if (!id) {
      throw new AppError('O ID do comentário é obrigatório.', 400);
    }

    const comment = await this.getCommentById(id);

    if (comment.commentType) { 
      await db.queryExecutor('DELETE FROM tags_comentarios WHERE comentario_id = $1', [Number(id)]);
      await db.queryExecutor('DELETE FROM comentarios WHERE root_post_id = $1', [Number(id)]);
    }

    const result = await db.queryExecutor(
      'DELETE FROM comentarios WHERE id = $1 RETURNING id',
      [Number(id)]
    );

    return result.length > 0;
  }

  static async addTagToComment(commentId, tagName) {
    if (!commentId || !tagName) {
      throw new AppError('O ID do comentário e o nome da Tag são obrigatórios.', 400);
    }

    let tagId;
    const tagExists = await db.queryExecutor('SELECT id FROM tags WHERE name = $1', [tagName.trim()]);
    
    if (tagExists.length > 0) {
      tagId = tagExists[0].id;
    } else {
      const novaTag = new Tag(tagName.trim());
      const insertedTag = await db.queryExecutor(
        'INSERT INTO tags (name) VALUES ($1) RETURNING id',
        [novaTag.name]
      );
      tagId = insertedTag[0].id;
    }

    await db.queryExecutor(
      'INSERT INTO tags_comentarios (comentario_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [Number(commentId), tagId]
    );

    return { commentId, tagId, tagName };
  }
}