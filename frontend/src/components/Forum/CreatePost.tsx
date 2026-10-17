import React, { useState, useEffect } from "react";
import styles from "./CreatePost.module.css";
import { supabase } from "../../services/supabase";

export function CreatePost(): React.JSX.Element {
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);

  const [nomeUsuario, setNomeUsuario] = useState("A carregar...");
  const [usuarioIdNumerico, setUsuarioIdNumerico] = useState<number | null>(null);

  useEffect(() => {
    async function carregarDadosDoUsuario() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setNomeUsuario(user.user_metadata?.nome_completo || "Utilizador");

        const { data: usuarioBanco, error } = await supabase
          .from('Usuarios')
          .select('idUsuario')
          .eq('Email', user.email)
          .single();

        if (usuarioBanco) {
          setUsuarioIdNumerico(usuarioBanco.idUsuario);
        } else {
          console.error("Este utilizador não foi encontrado na tabela 'Usuarios'.");
        }
      }
    }
    
    carregarDadosDoUsuario();
  }, []);

  const handlePublicar = async () => {
    if (!texto.trim()) return;

    if (usuarioIdNumerico === null) {
      alert("Atenção: A sua conta não está sincronizada com a tabela 'Usuarios'.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('Post')
        .insert([
          { 
            Conteudo: texto,
            Usuario_idUsuario: usuarioIdNumerico 
          }
        ]);

      if (error) throw error;
      
      alert("Publicado com sucesso!");
      setTexto(""); 
      
    } catch (error: any) {
      console.error("Erro ao publicar:", error.message);
      alert("Erro ao publicar. O banco de dados recusou a inserção.");
    } finally {
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
          disabled={loading || !usuarioIdNumerico}
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </div>
  );
}