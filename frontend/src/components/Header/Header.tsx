import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserService } from "../../services/userService";
import styles from "./Header.module.css";

export function Header(): React.JSX.Element {
  const [usuarioEstaLogado, setUsuarioEstaLogado] = useState(false);
  const [inicialUsuario, setInicialUsuario] = useState("U"); 

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      setUsuarioEstaLogado(true);
      
      async function carregarDadosHeader() {
        try {
          const dados = await UserService.getUser(userId!);
          const nome = dados.name || dados.username || dados.Nome || dados.Username || "U";
          setInicialUsuario(nome.charAt(0).toUpperCase());
        } catch (error) {
          console.error("Erro ao carregar dados no header:", error);
        }
      }
      
      carregarDadosHeader();
    } else {
      setUsuarioEstaLogado(false);
    }
  }, []);

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
          <Link to="/auth" style={{ textDecoration: 'none', color: '#fff', fontWeight: 'bold' }}>
            Entrar
          </Link>
        )}
      </div>

    </header>
  );
}