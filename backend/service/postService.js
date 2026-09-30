import { Post } from '../models/post.js';

export class PostService {
  createPost(authorId, content) {
    const newPost = new Post(
      null,
      authorId,
      content,
      new Date(),
      false,
      []
    );

    console.log(`Post criado com sucesso pelo utilizador ${authorId}!`);
    return newPost;
  }

  updatePost(postId, content) {
    console.log(`Conteúdo do post ${postId} atualizado com sucesso.`);
    return true;
  }

  deletePost(postId) {
    console.log(`Post com ID ${postId} eliminado.`);
    return true;
  }

  addTagToPost(postId, tagId) {
    console.log(`Tag ${tagId} adicionada ao post ${postId}.`);
    return true;
  }

  removeTagFromPost(postId, tagId) {
    console.log(`Tag ${tagId} removida do post ${postId}.`);
    return true;
  }
}