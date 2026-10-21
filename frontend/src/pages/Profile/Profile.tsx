import React from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { ProfileCard } from "../../components/Profile/ProfileCard";
import styles from "./Profile.module.css";

export function Profile(): React.JSX.Element {
  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.mainContent}>
        <ProfileCard />
      </main>

      <Footer />
    </div>
  );
}