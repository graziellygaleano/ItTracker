import React, { useState, useRef, useEffect } from "react";
import styles from "./FilterButton.module.css";

interface FilterButtonProps {
  opcoes: string[];
  filtroAtual: string;
  onSelect: (filtroSelecionado: string) => void;
}

export function FilterButton({ opcoes, filtroAtual, onSelect }: FilterButtonProps): React.JSX.Element {
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickFora(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const handleSelecionar = (opcao: string) => {
    onSelect(opcao);
    setMenuAberto(false);
  };

  return (
    <div className={styles.filterWrapper} ref={menuRef}>
      <button 
        className={styles.btnFilter} 
        onClick={() => setMenuAberto(!menuAberto)}
      >
        {filtroAtual} 
        <span className={styles.seta} style={{ transform: menuAberto ? 'rotate(180deg)' : 'none' }}>
          ▼
        </span>
      </button>

      {menuAberto && (
        <div className={styles.dropdownMenu}>
          {opcoes.map((opcao, index) => (
            <div 
              key={index} 
              className={styles.dropdownItem} 
              onClick={() => handleSelecionar(opcao)}
            >
              {opcao}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}