import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

export function Header(): React.JSX.Element {
  const usuarioEstaLogado = true; 

  // No futuro, quando a API estiver ligada, você vai pegar a primeira letra 
  // do nome do utilizador que veio do banco de dados (ex: usuario.nome.charAt(0))
  const inicialUsuario = "M"; 

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
          <Link to="/perfil" className={styles.profileLink}>
            <div className={styles.avatar}>
              {inicialUsuario}
            </div>
          </Link>
        ) : (
          <div style={{ width: "42px" }}></div>
        )}
      </div>

    </header>
  );
}