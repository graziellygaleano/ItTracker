import React, { useState, useEffect } from "react";
import styles from "./PostCard.module.css";

const API_URL = "http://localhost:3000/api/forum";

interface Comentario {
  id: number;
  texto: string;
  autor: string;
}

interface PostCardProps {
  id: number;
  autor: string;
  tags: string[]; 
  conteudo: string;
  isDono: boolean;
  comentariosIniciais?: Comentario[];
  onDelete: (id: number) => void; 
  onReply: (postId: number, texto: string) => void; 
}

export function PostCard({ id, autor, tags, conteudo, isDono, onDelete, onReply }: PostCardProps): React.JSX.Element {
  const [comentarioAberto, setComentarioAberto] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");
  const [listaComentarios, setListaComentarios] = useState<Comentario[]>([]);

  useEffect(() => {
  async function carregarRespostas() {
    try {
      const resposta = await fetch(`${API_URL}/comments/${id}/replies`);
      const dados = await resposta.json();
      setListaComentarios(
        dados.map((r: any) => ({
          id: r.commentID,
          texto: r.content,
          autor: r.authorName,
        }))
      );
    } catch (error) {
      console.error("Erro ao carregar respostas:", error);
    }
  }
  carregarRespostas();
}, [id]);

  const inicial = autor ? autor.charAt(0).toUpperCase() : "U";

  const handleDeletar = () => {
    if (window.confirm("Tem certeza que deseja apagar esta publicação?")) {
      onDelete(id); 
    }
  };

  const handleEnviarComentario = () => {
    if (novoComentario.trim() === "") return;
    
    onReply(id, novoComentario);

    setListaComentarios([
      ...listaComentarios, 
      { id: Date.now(), texto: novoComentario, autor: "Você" }
    ]);
    
    setNovoComentario("");
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

      {comentarioAberto && listaComentarios.length > 0 && (
  <div style={{ margin: '1rem 0', paddingLeft: '1rem', borderLeft: '3px solid #275296' }}>
          {listaComentarios.map((c) => (
            <div key={c.id} style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: '#334155' }}>
              <strong>{c.autor}:</strong> {c.texto}
            </div>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <button 
          className={styles.commentToggleBtn}
          onClick={() => setComentarioAberto(!comentarioAberto)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
          </svg>
          Comentar ({listaComentarios.length})
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