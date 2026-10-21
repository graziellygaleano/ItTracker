import React from "react";
import styles from "./TeamCard.module.css";

interface LinkItem {
  label: string;
  url: string;
}

interface TeamCardProps {
  nome: string;
  foto: string;
  bio: string;
  links: LinkItem[];
}

export function TeamCard({ nome, foto, bio, links }: TeamCardProps): React.JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img src={foto} alt={`Foto de ${nome}`} className={styles.avatar} />
        <h3 className={styles.name}>{nome}</h3>
      </div>
      
      <p className={styles.bio}>{bio}</p>
      
      <div className={styles.linksContainer}>
        {links.map((link, index) => (
          <a key={index} href={link.url} target="_blank" rel="noreferrer" className={styles.linkBadge}>
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}