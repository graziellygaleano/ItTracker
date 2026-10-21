import React, { useState } from "react";
import styles from "./CreatePost.module.css";

export function CreatePost(): React.JSX.Element {
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);

  // Como o frontend já não fala com o Supabase, o nome do utilizador 
  // virá do nosso AuthContext (que vamos integrar com a API depois)
  const nomeUsuario = "Malu"; // Valor temporário para a interface não quebrar

  const handlePublicar = async () => {
    if (!texto.trim()) return;

    setLoading(true);
    try {
      // ---------------------------------------------------------
      // FUTURO: Aqui o React vai enviar o texto para a sua API Node.js
      // Exemplo: await axios.post('http://localhost:3000/api/posts', { conteudo: texto })
      // ---------------------------------------------------------
      console.log("Enviando para o backend a postagem:", texto);
      
      // Simulação rápida para limpar a caixa
      setTimeout(() => {
        alert("Publicação enviada para a API com sucesso!");
        setTexto(""); 
        setLoading(false);
      }, 500);
      
    } catch (error: any) {
      console.error("Erro ao publicar:", error);
      alert("Erro ao comunicar com a API do backend.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.createCard}>
      <div className={styles.authorName}>{nomeUsuario}</div>
      
      <textarea 
        className={styles.textArea} 
        placeholder="Faça sua pergunta ou comentário para o IT-Tracker..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        disabled={loading}
      />
      
      <div className={styles.footer}>
        <button 
          className={styles.btnPublish} 
          onClick={handlePublicar} 
          disabled={loading}
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </div>
  );
}