import React, { useState, useEffect } from "react";
import styles from "./Carousel.module.css";

export interface SlideData {
  imageSrc: string;
  altText: string;
  caption: string;
}

interface CarouselProps {
  slides: SlideData[];
}

export function Carousel({ slides }: CarouselProps): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000); 

    return () => clearInterval(timer);
  }, [slides]);

  const goToSlide = (slideIndex: number): void => {
    setCurrentIndex(slideIndex);
  };

  if (!slides || slides.length === 0) {
    return <div>Nenhuma imagem disponível.</div>;
  }

  return (
    <div className={styles.carouselContainer}>
      <img 
        src={slides[currentIndex].imageSrc} 
        alt={slides[currentIndex].altText} 
        className={styles.slideImage} 
      />
      
      <p className={styles.caption}>
        {slides[currentIndex].caption}
      </p>

      <div className={styles.indicators}>
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`${styles.dot} ${currentIndex === index ? styles.dotActive : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}