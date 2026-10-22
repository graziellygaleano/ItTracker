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
    console.debug(`[ForumService:createComment] Iniciando criação de comentário. AuthorId: ${authorId}, rootPostId: ${rootPostId}`);
    
    if (!content || !content.trim()) {
      console.warn('[ForumService:createComment] Falha: conteúdo vazio.');
      throw new AppError('O conteúdo do comentário não pode estar vazio.', 400);
    }

    const commentType = rootPostId ? 1 : 0;
    const parentId = rootPostId ? Number(rootPostId) : null;
    console.debug(`[ForumService:createComment] Tipo definido como: ${commentType}`);

    if (parentId) {
      console.debug(`[ForumService:createComment] Verificando se o post pai (${parentId}) existe...`);
      const parentCheck = await crudComment.findById(parentId, "post");
      if (!parentCheck) {
        console.warn(`[ForumService:createComment] Post pai (${parentId}) não encontrado.`);
        throw new AppError('O post pai informado não existe.', 404);
      }
      console.debug(`[ForumService:createComment] Post pai (${parentId}) validado com sucesso.`);
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

    console.debug('[ForumService:createComment] Inserindo comentário no banco de dados...');
    const idInserido = await crudComment.createComment(novoComentario);
    console.debug(`[ForumService:createComment] Comentário criado com sucesso. ID gerado: ${idInserido}`);
    
    // --- MUDANÇA AQUI: Atualiza o post raiz automaticamente ---
    if (commentType === 1 && parentId) {
       console.debug(`[ForumService:createComment] Resposta criada! Atualizando post pai (${parentId}) para 'tem-respostas = 1'.`);
       await this.updateStatusComment(parentId, 1);
    }
    
    return { id: idInserido };
  }

  static async getCommentById(id, type = "post") {
    console.debug(`[ForumService:getCommentById] Buscando comentário. ID: ${id}, Tipo: ${type}`);
    
    if (!id) {
      console.warn('[ForumService:getCommentById] ID não informado.');
      throw new AppError('O ID do post/resposta é obrigatório.', 400);
    }

    const comment = await crudComment.findById(Number(id), type);
    if (!comment) {
      console.warn(`[ForumService:getCommentById] Comentário ID ${id} não encontrado.`);
      throw new AppError('Postagem não encontrada.', 404);
    }

    console.debug(`[ForumService:getCommentById] Comentário ID ${id} recuperado com sucesso.`);
    return comment;
  }

  static async getAllRootPosts() {
    console.debug('[ForumService:getAllRootPosts] Buscando todos os posts raiz...');
    const posts = await crudComment.findAll();
    console.debug(`[ForumService:getAllRootPosts] Retornando ${posts.length} posts raiz.`);
    return posts;
  }

  static async getReplies(rootPostId) {
    console.debug(`[ForumService:getReplies] Buscando respostas para o post pai ID: ${rootPostId}`);
    
    if (!rootPostId) {
      console.warn('[ForumService:getReplies] ID do post pai não informado.');
      throw new AppError('O ID da postagem pai é obrigatório.', 400);
    }

    const replies = await crudComment.getReply(Number(rootPostId));
    console.debug(`[ForumService:getReplies] Retornando ${replies.length} respostas para o post ID ${rootPostId}.`);
    return replies;
  }

  static async deleteComment(id, type = "post") {
    console.debug(`[ForumService:deleteComment] Tentativa de deletar comentário. ID: ${id}, Tipo: ${type}`);
    
    if (!id) {
      console.warn('[ForumService:deleteComment] ID não informado.');
      throw new AppError('O ID do post/resposta é obrigatório.', 400);
    }

    const result = await crudComment.deleteById(Number(id), type);
    if (result === 0) {
      console.warn(`[ForumService:deleteComment] Falha ao excluir. Comentário ID ${id} pode não existir.`);
      throw new AppError('Falha ao excluir. Postagem pode não existir.', 404);
    }
    
    console.debug(`[ForumService:deleteComment] Comentário ID ${id} deletado com sucesso.`);
    return true;
  }

  static async addTagToComment(postId, tagId) {
    console.debug(`[ForumService:addTagToComment] Associando Tag ID ${tagId} ao Post ID ${postId}`);

    if (!postId || !tagId) {
      console.warn('[ForumService:addTagToComment] ID do post ou da tag ausente.');
      throw new AppError('O ID do post e o ID da Tag são obrigatórios.', 400);
    }

    await db.queryExecutor(
      'INSERT INTO public."FiltroTags" ("idTag", "idPost") VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [Number(tagId), Number(postId)]
    );

    console.debug(`[ForumService:addTagToComment] Tag e Post associados com sucesso.`);
    return { postId, tagId };
  }

  static async removeTagFromComment(postId, tagId) {
    console.debug(`[ForumService:removeTagFromComment] Removendo Tag ID ${tagId} do Post ID ${postId}`);
    
    if (!postId || !tagId) {
      console.warn('[ForumService:removeTagFromComment] ID do post ou da tag ausente.');
      throw new AppError('O ID do post e o ID da Tag são obrigatórios.', 400);
    }

    await db.queryExecutor(
      'DELETE FROM public."FiltroTags" WHERE "idPost" = $1 AND "idTag" = $2',
      [Number(postId), Number(tagId)]
    );

    console.debug(`[ForumService:removeTagFromComment] Associação removida com sucesso.`);
    return { postId, tagId };
  }

  static async tagExists(tagName) {
    console.debug(`[ForumService:tagExists] Verificando existência da tag: "${tagName}"`);
    const tagsEncontradas = await crudTag.findByName(tagName.trim());
    const existe = tagsEncontradas.length > 0;
    console.debug(`[ForumService:tagExists] Tag "${tagName}" existe? ${existe}`);
    return existe;
  }

  static async createTag(tagName) {
    console.debug(`[ForumService:createTag] Solicitada criação da tag: "${tagName}"`);
    const novaTag = new Tag(tagName.trim(), null);
    const idInserido = await crudTag.createTag(novaTag);
    console.debug(`[ForumService:createTag] Tag criada com sucesso. ID gerado: ${idInserido}`);
    return { id: idInserido, name: tagName };
  }

  static async deleteTag(tagId) {
    console.debug(`[ForumService:deleteTag] Deletando tag ID: ${tagId}`);
    await crudTag.deleteById(Number(tagId));
    console.debug(`[ForumService:deleteTag] Tag ID ${tagId} deletada.`);
  }

  static async globalSearch(q, filters) {
    console.debug(`[ForumService:globalSearch] Iniciando busca global. Query: "${q}", Filtros:`, filters);
    const results = await crudComment.globalSearch(q, filters);
    console.debug(`[ForumService:globalSearch] Busca concluída. Resultados encontrados: ${results ? results.length : 0}`);
    return results;
  }

  static async updateStatusComment(postId, status) {
    console.debug(`[ForumService:updateStatusComment] Solicitada alteração de status do post ID: ${postId} para ${status}`);
    
    if (!postId || status === undefined) {
      console.warn('[ForumService:updateStatusComment] ID do post ou status não informados.');
      throw new AppError('O ID do post e o status são obrigatórios.', 400);
    }

    const novoStatus = Number(status) === 1 ? 1 : 0;

    const atualizado = await crudComment.updateStatusComment(postId, novoStatus);
    
    if (!atualizado) {
      throw new AppError('Postagem não encontrada para atualização de status.', 404);
    }

    return { postId, novoStatus, mensagem: "Status atualizado com sucesso." };
  }
}

export default ForumService;