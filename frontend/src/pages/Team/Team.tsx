import React from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { TeamCard } from "../../components/Team/TeamCard";
import styles from "./Team.module.css";

export function Team(): React.JSX.Element {
  const membrosEquipe = [
    {
      nome: "Aron Garcia",
      foto: "/img/aron.png", 
      bio: "Olá, me chamo Aron Garcia Mariano e sou estudante de Análise e Desenvolvimento de Sistemas. No momento eu busco expandir e desenvolver meus conhecimentos e habilidades na área de tecnologia, um campo o qual eu sempre tive interesse. Atualmente eu estou focado em ampliar minha base de conhecimentos e aperfeiçoar minhas capacidades na área de desenvolvimento de software.",
      links: [
        { label: "Acesse meu GitHub", url: "https://github.com/Aron-g-m" }
      ]
    },
    {
      nome: "Grazielly Galeano",
      foto: "/img/grazy.png",
      bio: "Oii, eu sou a Grazy! Me interesso muito pela área de jogos, desenvolvimento web e engenharia de software e atualmente minha linguagem de maior domínio é Python. No mundinho tech, pesquiso sobre um pouco de cada e se não conseguir me contactar nas redes de trabalho, me chame na STEAM ;)",
      links: [
        { label: "Acesse meu GitHub", url: "https://github.com/graziellygaleano" },
        { label: "Acesse meu LinkedIn", url: "https://www.linkedin.com/in/grazielly-galeano-422a43338/" },
      ]
    },
    {
      nome: "Maria Luiza Catalan",
      foto: "/img/malu.jpeg",
      bio: "Olá, me chamo Maria Luiza e atualmente sou aluna de ADS. Estou em busca de novos aprendizados e oportunidades para expandir meus conhecimentos na áerea. No momento estou focada em aperfeiçoar minha experiência com desenvolvimento de sistemas e prática em Python, C++, MySQL, HTML, CSS e JavaScript.",
      links: [
        { label: "Acesse meu GitHub", url: "https://github.com/malucatalan" },
        { label: "Acesse meu LinkedIn", url: "https://www.linkedin.com/in/maria-luiza-catalan-357240236/" },
      ]
    },
    {
      nome: "Thales Vialta",
      foto: "/img/thales.jpeg",
      bio: "Sempre tentei analisar e solucionar problemas invés de reclamar deles e deixa-los debaixo do tapete. Isso, adicionado a minha curiosidade por tecnologia desde os 7 anos de idade me trouxeram até ao mundo da programação. Tenho conhecimento em tecnologias como: Python, PHP, Java, MySQL, SQL Server, PostgreSQL Laravel e Django.",
      links: [
        { label: "Acesse meu GitHub", url: "https://github.com/Thales-Vialta" },
        { label: "Acesse meu LinkedIn", url: "https://www.linkedin.com/in/thalesvialta/" },
      ]
    }
  ];

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.mainContent}>
        
        <div className={styles.teamGrid}>
          {membrosEquipe.map((membro, index) => (
            <TeamCard 
              key={index}
              nome={membro.nome}
              foto={membro.foto}
              bio={membro.bio}
              links={membro.links}
            />
          ))}
        </div>

        <div className={styles.contactSection}>
          <h2 className={styles.contactTitle}>Gostaria de entrar em contato conosco?</h2>
          <div className={styles.contactBox}>
            <p className={styles.contactText}>
              <strong>Email:</strong> it-tracker.contato@gmail.com
            </p>
            <p className={styles.contactText}>
              <strong>Celular:</strong> 12 98765-4321
            </p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}