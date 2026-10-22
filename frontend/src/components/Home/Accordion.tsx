import React, { useState } from "react";
import styles from "./Accordion.module.css";

export interface FaqItemData {
  id: number;
  question: string;
  answer: React.ReactNode; 
}

interface AccordionProps {
  items: FaqItemData[];
}

export function Accordion({ items }: AccordionProps): React.JSX.Element {
  const [openId, setOpenId] = useState<number | null>(1);

  const handleToggle = (id: number): void => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <h2 className={styles.titulo}>Perguntas Frequentes</h2>
        
        <div className={styles.accordionList}>
          {items.map((item) => {
            const isOpen = openId === item.id;
            
            return (
              <div key={item.id} className={styles.item}>
                <button 
                  className={styles.header} 
                  onClick={() => handleToggle(item.id)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.iconToggle}>{isOpen ? "-" : "+"}</span>
                  <span className={`${styles.numberBox} ${isOpen ? styles.active : ""}`}>
                    {item.id}
                  </span>
                  <h3 className={styles.questionText}>{item.question}</h3>
                </button>
                
                {isOpen && (
                  <div className={styles.body}>
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}