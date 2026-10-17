import React from "react";
import { Link } from "react-router-dom";
import styles from "./GuestCard.module.css";

export function GuestCard(): React.JSX.Element {
  return (
    <div className={styles.cardContainer}>
      <h2 className={styles.title}>IT-Tracker</h2>
      <p className={styles.text}>
        Você está a visualizar o fórum como <strong>Visitante</strong>. Se quiser interagir, fazer perguntas ou responder a outros usuários, você precisa fazer o seu login ou criar uma conta.
      </p>
      <Link to="/auth" className={styles.loginButton}>
        Fazer Login
      </Link>
    </div>
  );
}