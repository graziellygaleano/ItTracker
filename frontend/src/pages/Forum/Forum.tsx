import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { GuestCard } from "../../components/Forum/GuestCard";
import { SearchBar } from "../../components/Forum/SearchBar";     
import { CreatePost } from "../../components/Forum/CreatePost";   
import { PostCard } from "../../components/Forum/PostCard"; 
import { UserService } from "../../services/userService"; 
import styles from "./Forum.module.css";

export function Forum(): React.JSX.Element {
  const [usuarioEstaLogado, setUsuarioEstaLogado] = useState(false);
  const [nomeAutor, setNomeAutor] = useState("");
  const [posts, setPosts] = useState<any[]>([]); 

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    
    if (userId) {
      setUsuarioEstaLogado(true);
      
      async function carregarDados() {
        try {
          const dados = await UserService.getUser(userId!);
          setNomeAutor(dados.name || dados.username || dados.Nome || dados.Username || "Utilizador");
        } catch (error) {
          console.error("Erro ao carregar dados no fórum:", error);
        }
      }
      carregarDados();
    } else {
      setUsuarioEstaLogado(false);
    }
  }, []);

  const handleCriarPost = async (conteudo: string, tags: string[]) => {
    console.log("Pronto para enviar para o backend:", { conteudo, tags });
    alert("Função de criar post preparada! Falta ligar à API.");
    // Aqui chamaremos a API no próximo passo
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
            <SearchBar />

            <div className={styles.createPostSection}>
              <CreatePost autorNome={nomeAutor} onPostCreated={handleCriarPost} />
            </div>

            <div className={styles.forumGrid}>
              <PostCard 
                autor={nomeAutor} 
                tags={["Dúvida", "Reservas"]} 
                conteudo="Alguém sabe me dizer se os Chromebooks da sala 4 já foram devolvidos ao armário?" 
                isDono={true} 
              />

              <PostCard 
                autor="Aron Garcia" 
                tags={["Aviso", "Atualização"]} 
                conteudo="Pessoal, acabei de atualizar a planilha de reservas. Verifiquem o sistema, por favor!" 
                isDono={false} 
              />
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