import React, { useState } from "react";
import styles from "./PostCard.module.css";

interface PostCardProps {
  autor: string;
  tags: string[]; 
  conteudo: string;
  isDono: boolean;
}

export function PostCard({ autor, tags, conteudo, isDono }: PostCardProps): React.JSX.Element {
  const [comentarioAberto, setComentarioAberto] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");

  const inicial = autor.charAt(0).toUpperCase();

  const handleDeletar = () => {
    if (window.confirm("Tem certeza que deseja apagar esta publicação?")) {
      console.log("Post apagado!");
    }
  };

  const handleEnviarComentario = () => {
    if (novoComentario.trim() === "") return;
    console.log("Comentário enviado:", novoComentario);
    setNovoComentario("");
    setComentarioAberto(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <div className={styles.avatar}>{inicial}</div>
          <div className={styles.authorText}>
            <h3 className={styles.authorName}>{autor}</h3>
            <div className={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <span key={index} className={styles.tagBadge}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {isDono && (
          <button className={styles.deleteBtn} onClick={handleDeletar} title="Apagar publicação">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        )}
      </div>

      <div className={styles.content}>
        {conteudo}
      </div>

      <div className={styles.footer}>
        <button 
          className={styles.commentToggleBtn}
          onClick={() => setComentarioAberto(!comentarioAberto)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
          </svg>
          Comentar
        </button>

        {comentarioAberto && (
          <div className={styles.commentSection}>
            <input 
              type="text" 
              className={styles.commentInput} 
              placeholder="Escreva um comentário..." 
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEnviarComentario()}
            />
            <button className={styles.sendCommentBtn} onClick={handleEnviarComentario}>
              Enviar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}