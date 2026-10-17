import React from "react";
import { Header } from "../../components/Header/Header";
import { Carousel, type SlideData } from "../../components/Home/Carousel";
import { Buttons } from "../../components/Home/Button";
import { Accordion, type FaqItemData } from "../../components/Home/Accordion";
import { Footer } from "../../components/Footer/Footer";
import styles from "./Home.module.css";

const DADOS_CARROSSEL: SlideData[] = [
  {
    imageSrc: "/img/computadores.JPG",
    altText: "Armazenamento de computadores",
    caption: "Armazenamento de computadores utilizados em aula."
  },
  {
    imageSrc: "/img/horarios.JPG",
    altText: "Armário dos Computadores",
    caption: "Controle de horários de funcionamento."
  },
  {
    imageSrc: "/img/lista.JPG",
    altText: "Lista empréstimos",
    caption: "Controle de empréstimos dos computadores."
  }
];

const DADOS_FAQ: FaqItemData[] = [
  {
    id: 1,
    question: "Para quem é feito nosso produto?",
    answer: (
      <p>
        Nosso produto foi pensado para <strong>escolas públicas</strong> terem mais acesso à tecnologia e conseguirem organizar e distribuir seus aparelhos eletrônicos de <strong>forma fácil e eficiente</strong>. Mas ele também é <strong>aberto para todos</strong> os espaços que buscam mais conforto e rapidez para essa tarefa!
      </p>
    ),
  },
  {
    id: 2,
    question: "Como utilizar nosso sistema?",
    answer: <p>Aqui vai a explicação de como utilizar o sistema passo a passo.</p>,
  },
  {
    id: 3,
    question: "Como entrar em contato conosco?",
    answer: <p>Você pode entrar em contato através do nosso Fórum ou e-mail de suporte.</p>,
  },
];

export function Home(): React.JSX.Element {
  return (
    <div className={styles.homeContainer}>
      
      <Header />

      <main className={styles.mainSection}>
        <div className={styles.contentWrapper}>
          
          <div className={styles.carouselColumn}>
            <Carousel slides={DADOS_CARROSSEL} />
          </div>

          <div className={styles.textColumn}>
            <h1 className={styles.titulo}>
              Quer fazer um comentário?<br />
              Tem uma pergunta?
            </h1>
            
            <p className={styles.subtitulo}>
              Faça seu login ou cadastro para acessar o fórum.
            </p>
            
            <div className={styles.botoesWrapper}>
              <Buttons texto="Acesse sua conta" to="/auth" />
            </div>
          </div>

        </div>
      </main>

      <section className={styles.infoSection}>
        <div className={styles.infoWrapper}>
          
          <div className={styles.infoText}>
            <h2 className={styles.infoTitle}>O que é o IT-Tracker?</h2>
            <p className={styles.infoParagraph}>
              Em muitas instituições de ensino, o controle de dispositivos eletrônicos preciosos — como tablets, notebooks e Chromebooks — ainda é feito de forma manual em cadernos ou planilhas, sobrecarregando uma única pessoa e gerando falhas de organização. O <strong>IT-Tracker</strong> surge para solucionar esse problema crítico. Nossa plataforma digital automatiza o processo de reservas e empréstimos desses ativos tecnológicos. Com um sistema intuitivo, transformamos a gestão burocrática em um fluxo rápido, transparente e acessível para toda a equipe escolar. Aqui você encontrará <strong>perguntas e respostas</strong> sobre como utilizar esse sistema.
            </p>
          </div>

          <div className={styles.infoImageWrapper}>
            <img 
              src="/img/img-inicial.webp" 
              alt="Ilustração a mostrar gráficos e gestão de dados" 
              className={styles.infoImage}
            />
          </div>

        </div>
      </section>

      <Accordion items={DADOS_FAQ} />
      <Footer />

    </div>
  );
}