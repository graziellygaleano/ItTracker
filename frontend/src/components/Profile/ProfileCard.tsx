import React, { useState } from "react";
import styles from "./ProfileCard.module.css";

export function ProfileCard(): React.JSX.Element {
  const [nome, setNome] = useState("Malu Catalan");
  const [email, setEmail] = useState("malu.catalan@exemplo.com");
  const [senha, setSenha] = useState("13112004");
  
  const [mostrarSenha, setMostrarSenha] = useState(false); 

  const inicial = nome ? nome.charAt(0).toUpperCase() : "U";

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Alterações salvas com sucesso!");
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{inicial}</div>
          <div className={styles.nameBlock}>
            <h2>Olá, {nome.split(' ')[0]}</h2>
            <p>Gerencie as informações da sua conta</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSalvar}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nome Completo</label>
            <input 
              type="text" 
              className={styles.input} 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>E-mail</label>
            <input 
              type="email" 
              className={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Nova Senha</label>
            <div className={styles.passwordWrapper}>
              
              <input 
                type={mostrarSenha ? "text" : "password"} 
                className={styles.input} 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite para alterar a senha"
              />
              
              <button 
                type="button" 
                className={styles.eyeButton}
                onClick={() => setMostrarSenha(!mostrarSenha)}
                title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                    <line x1="2" y1="2" x2="22" y2="22"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>

            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button type="button" className={`${styles.btn} ${styles.btnDelete}`}>
            Excluir Conta
          </button>
          
          <div className={styles.rightButtons}>
            <button type="button" className={`${styles.btn} ${styles.btnLogout}`}>
              Sair da conta
            </button>
            <button type="submit" className={`${styles.btn} ${styles.btnSave}`}>
              Salvar Alterações
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}