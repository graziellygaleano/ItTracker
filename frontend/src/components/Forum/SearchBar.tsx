import React from "react";
import styles from "./SearchBar.module.css";
import { Buttons } from "../Home/Button";

export function SearchBar(): React.JSX.Element {
  return (
    <div className={styles.filterContainer}>
      <div className={styles.searchWrapper}>
        <input 
          type="text" 
          className={styles.searchInput} 
          placeholder="Pesquisar no fórum..." 
        />
        <span className={styles.searchIcon}>🔍</span>
      </div>
      
      <Buttons texto="Todas perguntas" to="/forum" />
    </div>
  );
}