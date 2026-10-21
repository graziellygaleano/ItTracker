import Comment from "../models/comment.js";
class CrudComment {
  constructor(dao) {
    this.dao = dao;
  }

  async createComment(comment) {
    if (comment.commentType === "resposta") {
      const sql = `
        INSERT INTO public."RespostaPost"
          ("Conteudo", "DataPost", "Post_idPost", "Usuario_idUsuario")
        VALUES ($1, $2, $3, $4)
        RETURNING "idResposta"
      `;

      const rows = await this.dao.queryExecutor(sql, [
        comment.content,
        comment.commentDate || new Date(),
        comment.rootPostID,
        comment.authorId
      ]);

      return rows[0].idResposta;
    }

    const sql = `
      INSERT INTO public."Post"
        ("Conteudo", "DataPost", "Usuario_idUsuario")
      VALUES ($1, $2, $3)
      RETURNING "idPost"
    `;

    const rows = await this.dao.queryExecutor(sql, [
      comment.content,
      comment.commentDate || new Date(),
      comment.authorId
    ]);

    return rows[0].idPost;
  }

  async findById(id, type = "post") {
    const isReply = type === "resposta";

    const sql = isReply
      ? `
        SELECT
          r."idResposta" AS id,
          r."Conteudo" AS content,
          r."DataPost" AS comment_date,
          r."Usuario_idUsuario" AS author_id,
          r."Post_idPost" AS root_post_id
        FROM public."RespostaPost" r
        WHERE r."idResposta" = $1
      `
      : `
        SELECT
          p."idPost" AS id,
          p."Conteudo" AS content,
          p."DataPost" AS comment_date,
          p."Usuario_idUsuario" AS author_id,
          p."idPost" AS root_post_id,
          EXISTS (
            SELECT 1
            FROM public."RespostaPost" r
            WHERE r."Post_idPost" = p."idPost"
          ) AS has_replies
        FROM public."Post" p
        WHERE p."idPost" = $1
      `;

    const rows = await this.dao.queryExecutor(sql, [id]);

    if (rows.length === 0) return null;

    const c = rows[0];

    return new Comment(
      isReply ? "resposta" : "post",
      c.id,
      c.author_id,
      c.content,
      c.comment_date,
      c.has_replies || false,
      c.root_post_id
    );
  }
  async findAll(){
    const sql = 'SELECT p."idPost" as id, p."Conteudo" as content, p."DataPost" as comment_date, p."Usuario_idUsuario" as author_id, p."idPost" as root_post_id, EXISTS (SELECT 1 from public."RespostaPost" r WHERE r."Post_idPost" = p."idPost") as has_replies from public."Post" p Order BY p."DataPost" DESC';

    const rows = await this.dao.queryExecutor(sql);

    return rows.map(c => new Comment( 
        "post", 
        c.id, 
        c.author_id,
        c.content,
        c.comment_date,
        c.has_replies, 
        c.root_post_id
    ));
  }
  async getReply(postId) {
    const sql = 'SELECT r."idResposta" AS id, r."Conteudo" AS content, r."DataPost" AS comment_date, r."Usuario_idUsuario" AS author_id, r."Post_idPost" AS root_post_id FROM public."RespostaPost" r WHERE r."Post_idPost" = $1 ORDER BY r."DataPost" ASC';

      const rows = await this.dao.queryExecutor(sql, [postId]);

      return rows.map(c => new Comment(
      "resposta",
      c.id,
      c.author_id,
      c.content,
      c.comment_date,
      false,
      c.root_post_id
    ));
  }
  async deleteById(id, type = "post") {
    if (type === "resposta") {
        const sql = 'DELETE from public."RespostaPost" WHERE "idResposta" = $1 Returning "idResposta"';
        
        const rows = await this.dao.queryExecutor(sql,[id]);
        return rows.length;
    }
    return this.dao.transaction(async client => {
        await client.query('DELETE FROM public."FiltroTags" Where "Post_idPost" = $1',[id]);
      
        await client.query(
        `DELETE FROM public."RespostaPost"
         WHERE "Post_idPost" = $1`,
        [id]
      );
      
    const result = await client.query('DELETE FROM public."Post" WHERE "idPost" = $1 Returning "idPost"',[id]);
      return result.rows.length;
    });
  }

async globalSearch(q = '', filters = {}) {
    const { status, tagId } = filters;
    let sql = `
      SELECT DISTINCT 
        p."idPost" AS id, 
        p."Conteudo" AS content, 
        p."DataPost" AS comment_date, 
        p."Usuario_idUsuario" AS author_id, 
        p."idPost" AS root_post_id,
        (p."tem-respostas" = 1) AS has_replies
      FROM public."Post" p
      LEFT JOIN public."FiltroTags" ft ON ft."idPost" = p."idPost"
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (q && q.trim() !== '') {
      sql += ` AND p."Conteudo" ILIKE $${paramIndex}`;
      params.push(`%${q.trim()}%`);
      paramIndex++;
    }

    if (tagId) {
      sql += ` AND ft."idTag" = $${paramIndex}`;
      params.push(Number(tagId));
      paramIndex++;
    }

    if (status === 'respondidas') {
      sql += ` AND p."tem-respostas" = 1`;
    } else if (status === 'nao_respondidas') {
      sql += ` AND (p."tem-respostas" IS NULL OR p."tem-respostas" != 1)`;
    }

    sql += ` ORDER BY p."DataPost" DESC`;

    const rows = await this.dao.queryExecutor(sql, params);

    return rows.map(c => new Comment(
      "post",
      c.id,
      c.author_id,
      c.content,
      c.comment_date,
      c.has_replies,
      c.root_post_id
    ));
  }
}
export default CrudComment;