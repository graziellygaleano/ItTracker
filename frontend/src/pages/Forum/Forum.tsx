import React from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { GuestCard } from "../../components/Forum/GuestCard";
import { SearchBar } from "../../components/Forum/SearchBar";     
import { CreatePost } from "../../components/Forum/CreatePost";   
import styles from "./Forum.module.css";

export function Forum(): React.JSX.Element {
  const usuarioEstaLogado = true;

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

            <div className={styles.forumGrid}>
              <CreatePost />
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