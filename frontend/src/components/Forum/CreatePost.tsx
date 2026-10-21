import React, { useState } from "react";
import styles from "./CreatePost.module.css";

const TAGS_DISPONIVEIS = [
  "Dúvida", "Informação", "Aviso", 
  "Login/Cadastro", "Atualização", 
  "Dispositivos", "Reservas"
];

export function CreatePost(): React.JSX.Element {
  const [conteudo, setConteudo] = useState("");
  const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>([]);

  const handleToggleTag = (tagClicada: string) => {
    // Se a tag já estiver selecionada, remove-a
    if (tagsSelecionadas.includes(tagClicada)) {
      setTagsSelecionadas(tagsSelecionadas.filter(tag => tag !== tagClicada));
    } 
    // Se não estiver e o limite ainda não foi atingido, adiciona-a
    else if (tagsSelecionadas.length < 2) {
      setTagsSelecionadas([...tagsSelecionadas, tagClicada]);
    }
  };

  const handlePublicar = () => {
    if (conteudo.trim() === "") return;
    
    console.log("Publicando:", conteudo, "Tags:", tagsSelecionadas);
    
    // Limpa o formulário após publicar
    setConteudo("");
    setTagsSelecionadas([]);
    alert("Post publicado com sucesso!");
  };

  return (
    <div className={styles.createCard}>
      <h3 className={styles.authorName}>Malu Catalan</h3>
      
      <textarea 
        className={styles.textArea} 
        placeholder="Faça sua pergunta ou comentário para o IT-Tracker..."
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
      />

      <div>
        <label className={styles.tagsLabel}>
          Categorias <span>(escolha até 2)</span>
        </label>
        <div className={styles.tagsSelection}>
          {TAGS_DISPONIVEIS.map((tag) => {
            const isSelected = tagsSelecionadas.includes(tag);
            const isLimitReached = tagsSelecionadas.length >= 2;
            const isDisabled = !isSelected && isLimitReached;

            return (
              <div 
                key={tag}
                className={`
                  ${styles.tagOption} 
                  ${isSelected ? styles.selected : ''} 
                  ${isDisabled ? styles.disabled : ''}
                `}
                onClick={() => !isDisabled && handleToggleTag(tag)}
              >
                {tag}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <button 
          className={styles.btnPublish} 
          onClick={handlePublicar}
          disabled={conteudo.trim() === "" || tagsSelecionadas.length === 0}
        >
          Publicar
        </button>
      </div>
    </div>
  );
}