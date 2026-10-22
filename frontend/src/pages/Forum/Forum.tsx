import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { GuestCard } from "../../components/Forum/GuestCard";    
import { CreatePost } from "../../components/Forum/CreatePost";   
import { PostCard } from "../../components/Forum/PostCard"; 
import { UserService } from "../../services/userService"; 
import styles from "./Forum.module.css";

const API_URL = "http://localhost:3000/api/forum"; 

export function Forum(): React.JSX.Element {
  const [usuarioEstaLogado, setUsuarioEstaLogado] = useState(false);
  const [nomeAutor, setNomeAutor] = useState("");
  const [posts, setPosts] = useState<any[]>([]); 

  const carregarPosts = async () => {
    try {
      const resposta = await fetch(`${API_URL}/search`); 
      const dados = await resposta.json();
      setPosts(dados);
    } catch (error) {
      console.error("Erro ao carregar o mural:", error);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    
    if (userId) {
      setUsuarioEstaLogado(true);
      
      async function carregarDados() {
        try {
          const dados = await UserService.getUser(userId!);
          setNomeAutor(dados.name || dados.username || dados.Nome || dados.Username || "Utilizador");
        } catch (error) {
          console.error("Erro ao carregar utilizador:", error);
        }
      }
      carregarDados();
    } else {
      setUsuarioEstaLogado(false);
    }

    carregarPosts();
  }, []);

  const handleCriarPost = async (conteudo: string, tags: string[]) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const respostaPost = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: userId, content: conteudo })
      });
      
      const dadosPost = await respostaPost.json();
      const novoPostId = dadosPost.id; 

      const tagMap: { [key: string]: number } = {
        "Dúvida": 1,
        "Informação": 2,
        "Aviso": 3,
        "Login/Cadastro": 4,
        "Atualização": 5,
        "Dispositivos": 6,
        "Reservas": 7
      };

      if (novoPostId && tags.length > 0) {
        for (const nomeTag of tags) {
          const tagId = tagMap[nomeTag];
          if (tagId) {
            await fetch(`${API_URL}/comments/${novoPostId}/tags`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tagId: tagId })
            });
          }
        }
      }
      
      alert("Publicação criada com sucesso!");
      carregarPosts(); 
    } catch (error) {
      alert("Ocorreu um erro ao publicar.");
    }
  };

  const handleDeletarPost = async (postId: number) => {
    try {
      await fetch(`${API_URL}/comments/${postId}`, {
        method: "DELETE"
      });
      carregarPosts(); 
    } catch (error) {
      alert("Erro ao tentar apagar a publicação.");
    }
  };

  const handleResponderPost = async (postId: number, texto: string) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          authorId: userId, 
          content: texto,
          rootPostId: postId 
        })
      });
      
      alert("Comentário enviado com sucesso!");
      carregarPosts(); 
    } catch (error) {
      alert("Erro ao enviar o comentário.");
    }
  };

  return (
    <div className={styles.forumContainer}>
      <Header />

      <main className={styles.mainContent}>
        <h1 className={styles.titulo}>Fórum de Discussão</h1>
        <p className={styles.descricao}>
          Bem-vindo ao fórum do IT-Tracker. Deixe o seu comentário, dúvida ou sugestão sobre o sistema.
        </p>

        {usuarioEstaLogado ? (
          <>

            <div className={styles.createPostSection}>
              <CreatePost autorNome={nomeAutor} onPostCreated={handleCriarPost} />
            </div>

            <div className={styles.forumGrid}>
              {posts.map((post) => (
                <PostCard 
                  key={post.commentID}
                  id={post.commentID}
                  autor={post.authorName || `Utilizador ${post.authorId}`}
                  tags={post.tags || []} 
                  conteudo={post.content} 
                  isDono={post.authorId === Number(localStorage.getItem("userId"))} 
                  onDelete={handleDeletarPost}
                  onReply={handleResponderPost} 
                />
              ))}
            </div>
          </>
        ) : (
          <GuestCard />
        )}
      </main>

      <Footer />
    </div>
  );
}