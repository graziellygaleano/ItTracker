import React from "react";
import styles from "./Footer.module.css";

export function Footer(): React.JSX.Element {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className={styles.footerContainer}>
      <p style={{ margin: 0 }}>
        © {anoAtual} IT-Tracker. Todos os direitos reservados.
      </p>
    </footer>
  );
}