import React, { useState } from "react";
import styles from "./SearchBar.module.css";
import { FilterButton } from "./FilterButton";

export function SearchBar(): React.JSX.Element {
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [filtroAtual, setFiltroAtual] = useState("Todas perguntas");

  const executarPesquisa = () => {
    console.log(`Buscando por: "${termoPesquisa}" com o filtro: "${filtroAtual}"`);
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.searchWrapper}>
        <input 
          type="text" 
          className={styles.searchInput} 
          placeholder="Pesquisar no fórum..." 
          value={termoPesquisa}
          onChange={(e) => setTermoPesquisa(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && executarPesquisa()}
        />
      </div>
      
      <FilterButton 
        filtroAtual={filtroAtual}
        opcoes={["Todas perguntas", "Respondidas", "Não respondidas"]}
        onSelect={(opcao) => {
          setFiltroAtual(opcao);
        }}
      />
    </div>
  );
}