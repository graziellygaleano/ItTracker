import React from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { GuestCard } from "../../components/Forum/GuestCard";
import { SearchBar } from "../../components/Forum/SearchBar";     
import { CreatePost } from "../../components/Forum/CreatePost";   
import { PostCard } from "../../components/Forum/PostCard"; // Lembre-se de importar o PostCard!
import styles from "./Forum.module.css";

export function Forum(): React.JSX.Element {
  const usuarioEstaLogado = true; // Mantemos true para ver o mural

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

            {/* 1. CAIXA DE CRIAR POST (Linha inteira no topo) */}
            <div className={styles.createPostSection}>
              <CreatePost />
            </div>

            {/* 2. MURAL DE POSTS PUBLICADOS (Grelha em baixo) */}
            <div className={styles.forumGrid}>
              <PostCard 
                autor="Malu Catalan" 
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