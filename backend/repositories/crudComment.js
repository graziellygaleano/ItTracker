import Comment from "../models/comment.js";

class CrudComment {
  constructor(dao) {
    this.dao = dao;
    console.debug('[CrudComment:constructor] Instância de CrudComment inicializada.');
  }

  async createComment(comment) {
    console.debug(`[CrudComment:createComment] Iniciando criação de comentário. Tipo: ${comment.commentType}, AuthorID: ${comment.authorId}`);

    // Verifica se o tipo é 1 (resposta)
    if (Number(comment.commentType) === 1) {
      console.debug('[CrudComment:createComment] Executando INSERT na tabela "RespostaPost"...');
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

      console.debug(`[CrudComment:createComment] Resposta inserida com sucesso. ID gerado: ${rows[0].idResposta}`);
      return rows[0].idResposta;
    }

    // Se for tipo 0, cai direto aqui e insere como post raiz
    console.debug('[CrudComment:createComment] Executando INSERT na tabela "Post"...');
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

    console.debug(`[CrudComment:createComment] Post inserido com sucesso. ID gerado: ${rows[0].idPost}`);
    return rows[0].idPost;
  }

  async findById(id, type = "post") {
    console.debug(`[CrudComment:findById] Buscando registro no banco. ID: ${id}, Tipo: ${type}`);
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

    if (rows.length === 0) {
      console.debug(`[CrudComment:findById] Nenhum registro encontrado para o ID: ${id}`);
      return null;
    }

    console.debug(`[CrudComment:findById] Registro encontrado com sucesso para o ID: ${id}`);
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

  async findAll() {
    console.debug('[CrudComment:findAll] Buscando todos os posts raiz no banco de dados...');
    const sql = 'SELECT p."idPost" as id, p."Conteudo" as content, p."DataPost" as comment_date, p."Usuario_idUsuario" as author_id, p."idPost" as root_post_id, EXISTS (SELECT 1 from public."RespostaPost" r WHERE r."Post_idPost" = p."idPost") as has_replies from public."Post" p Order BY p."DataPost" DESC';

    const rows = await this.dao.queryExecutor(sql);
    console.debug(`[CrudComment:findAll] Busca concluída. Total de posts raiz encontrados: ${rows.length}`);

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
    console.debug(`[CrudComment:getReply] Buscando respostas vinculadas ao post ID: ${postId}`);
    const sql = `
  SELECT
    r."idResposta" AS id,
    r."Conteudo" AS content,
    r."DataPost" AS comment_date,
    r."Usuario_idUsuario" AS author_id,
    perf."Nome" AS author_name,
    r."Post_idPost" AS root_post_id
  FROM public."RespostaPost" r
  LEFT JOIN public."Perfil" perf ON perf."idPerfil" = r."Usuario_idUsuario"
  WHERE r."Post_idPost" = $1
  ORDER BY r."DataPost" ASC
`;

    const rows = await this.dao.queryExecutor(sql, [postId]);
    console.debug(`[CrudComment:getReply] Total de respostas encontradas para o post ID ${postId}: ${rows.length}`);

    return rows.map(c => new Comment(
  "resposta",
  c.id,
  c.author_id,
  c.content,
  c.comment_date,
  false,
  c.root_post_id,
  c.author_name   // <-- novo
));
  }

  async deleteById(id, type = "post") {
    console.debug(`[CrudComment:deleteById] Solicitada exclusão. ID: ${id}, Tipo: ${type}`);
    
    if (type === "resposta") {
        const sql = 'DELETE from public."RespostaPost" WHERE "idResposta" = $1 Returning "idResposta"';
        const rows = await this.dao.queryExecutor(sql, [id]);
        console.debug(`[CrudComment:deleteById] Exclusão de resposta finalizada. Linhas afetadas: ${rows.length}`);
        return rows.length;
    }

    console.debug(`[CrudComment:deleteById] Iniciando transação para excluir o post ID ${id} e suas dependências...`);
    return this.dao.transaction(async client => {
        await client.query('DELETE FROM public."FiltroTags" Where "idPost" = $1', [id]);
        console.debug(`[CrudComment:deleteById] Tags associadas removidas do post ID ${id}.`);
      
        await client.query(`DELETE FROM public."RespostaPost" WHERE "Post_idPost" = $1`, [id]); 
        console.debug(`[CrudComment:deleteById] Respostas associadas removidas do post ID ${id}.`);
      
        const result = await client.query('DELETE FROM public."Post" WHERE "idPost" = $1 Returning "idPost"', [id]);
        console.debug(`[CrudComment:deleteById] Post ID ${id} deletado. Linhas afetadas: ${result.rows.length}`);
        return result.rows.length;
    });
  }

  async globalSearch(q = '', filters = {}) {
    const { status, tagId } = filters;
    
    let sql = `
      SELECT 
        p."idPost" AS id, 
        p."Conteudo" AS content, 
        p."DataPost" AS comment_date, 
        p."Usuario_idUsuario" AS author_id, 
        perf."Nome" AS author_name,
        p."idPost" AS root_post_id,
        (p."tem-respostas" = 1) AS has_replies,
        COALESCE(
          (SELECT json_agg(t."TipoTag")
           FROM public."FiltroTags" ft
           JOIN public."Tags" t ON t."idTag" = ft."idTag"
           WHERE ft."idPost" = p."idPost"),
          '[]'::json
        ) AS tags
      FROM public."Post" p
      LEFT JOIN public."Perfil" perf ON perf."idPerfil" = p."Usuario_idUsuario"
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
      sql += ` AND EXISTS (
        SELECT 1 FROM public."FiltroTags" ft_filter 
        WHERE ft_filter."idPost" = p."idPost" AND ft_filter."idTag" = $${paramIndex}
      )`;
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
      c.root_post_id,
      c.author_name,
      c.tags || []
    ));
  }

  // --- MUDANÇA AQUI: Função que faz o UPDATE do status no banco ---
  async updateStatusComment(postId, status) {
    console.debug(`[CrudComment:updateStatusComment] Atualizando post ID ${postId} para "tem-respostas" = ${status}`);
    
    const sql = `
      UPDATE public."Post" 
      SET "tem-respostas" = $1 
      WHERE "idPost" = $2 
      RETURNING "idPost"
    `;

    const rows = await this.dao.queryExecutor(sql, [Number(status), Number(postId)]);
    
    if (rows.length === 0) {
      console.warn(`[CrudComment:updateStatusComment] Post ID ${postId} não encontrado para atualização.`);
      return false;
    }

    console.debug(`[CrudComment:updateStatusComment] Post ID ${postId} atualizado com sucesso.`);
    return true;
  }
}

export default CrudComment;