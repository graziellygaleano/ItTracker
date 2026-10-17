import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

export function Header(): React.JSX.Element {
  // ------------------------------------------------------------------
  // VARIÁVEL DE TESTE:
  // No futuro, quando o utilizador fizer login, o backend vai mudar isto para "true".
  // Por enquanto, experimente mudar a palavra "false" para "true" e guardar o ficheiro!
  // ------------------------------------------------------------------
  const usuarioEstaLogado = false; 

  return (
    <header className={styles.headerContainer}>
      
      <div>
        <Link to="/" className={styles.logo}>
          IT-Tracker
        </Link>
      </div>

      <nav className={styles.navLinks}>
        <Link to="/" className={styles.navItem}>Home</Link>
        <Link to="/equipe" className={styles.navItem}>Equipe</Link>
        <Link to="/forum" className={styles.navItem}>Fórum</Link>
      </nav>

      <div>
        {usuarioEstaLogado ? (
          <Link to="/perfil">
            <img 
              src="/img/account-white-icon.webp" 
              alt="Perfil" 
              className={styles.profileIcon} 
            />
          </Link>
        ) : (
          <div style={{ width: "35px" }}></div>
        )}
      </div>

    </header>
  );
}