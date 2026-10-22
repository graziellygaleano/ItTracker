import React, { useState } from "react";
import styles from "./CreatePost.module.css";

const TAGS_DISPONIVEIS = [
  "Dúvida", "Informação", "Aviso", 
  "Login/Cadastro", "Atualização", 
  "Dispositivos", "Reservas"
];

interface CreatePostProps {
  autorNome: string;
  onPostCreated: (conteudo: string, tags: string[]) => void;
}

export function CreatePost({ autorNome, onPostCreated }: CreatePostProps): React.JSX.Element {
  const [conteudo, setConteudo] = useState("");
  const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>([]);
  const inicial = autorNome ? autorNome.charAt(0).toUpperCase() : "U";

  const handleToggleTag = (tagClicada: string) => {
    if (tagsSelecionadas.includes(tagClicada)) {
      setTagsSelecionadas(tagsSelecionadas.filter(tag => tag !== tagClicada));
    } else if (tagsSelecionadas.length < 2) {
      setTagsSelecionadas([...tagsSelecionadas, tagClicada]);
    }
  };

  const handlePublicar = () => {
    if (conteudo.trim() === "") return;
    
    onPostCreated(conteudo, tagsSelecionadas);
    
    setConteudo("");
    setTagsSelecionadas([]);
  };

  return (
    <div className={styles.createCard}>
      
      {/* Cabeçalho corrigido: o {inicial} vai dentro da div do avatar! */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <div className={styles.avatar}>{inicial}</div>
        <h3 className={styles.authorName} style={{ margin: 0 }}>{autorNome}</h3>
      </div>
      
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