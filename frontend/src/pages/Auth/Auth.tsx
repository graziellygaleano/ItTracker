import React from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { AuthCard } from "../../components/Auth/AuthCard";
import styles from "./Auth.module.css";

export function Auth(): React.JSX.Element {
  return (
    <div className={styles.authContainer}>
      <Header />

      <main className={styles.mainContent}>
        <AuthCard />
      </main>

      <Footer />
    </div>
  );
}