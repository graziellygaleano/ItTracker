import React from "react";
import { Link } from "react-router-dom";
import styles from "./Button.module.css";

interface ButtonsProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly texto: string;
  readonly to?: string; 
}

export function Buttons({ texto, to, className, ...props }: ButtonsProps): React.JSX.Element {
  const classesCombinadas = `${styles.botao} ${className || ""}`.trim();

  if (to) {
    return (
      <Link to={to} className={classesCombinadas}>
        {texto}
      </Link>
    );
  }

  return (
    <button className={classesCombinadas} {...props}>
      {texto}
    </button>
  );
}