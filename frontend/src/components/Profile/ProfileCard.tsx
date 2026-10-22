import React, { useState, useEffect } from "react";
import { UserService } from "../../services/userService";
import styles from "./ProfileCard.module.css";

export function ProfileCard(): React.JSX.Element {
  const [nome, setNome] = useState("Carregando...");
  const [email, setEmail] = useState("carregando@...");
  
  const [senha, setSenha] = useState("");

  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    if (!userId) {
      window.location.href = "/auth";
      return;
    }

    async function carregarPerfil() {
      try {
        const dados = await UserService.getUser(userId!);
        setNome(dados.name || dados.username || dados.Nome || dados.Username || "");
        setEmail(dados.email || dados.Email || dados.emailHash || "");
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    }
    
    carregarPerfil();
  }, [userId]);

  const inicial = nome ? nome.charAt(0).toUpperCase() : "U";

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await UserService.updateProfile(userId!, 'name', nome);
      
      if (senha.trim() !== "") {
        await UserService.updateProfile(userId!, 'passHash', senha);
      }

      alert("Perfil atualizado com sucesso!");
      setSenha(""); 
    } catch (error: any) {
      alert(error.message || "Erro ao atualizar perfil.");
    }
  };

  const handleLogout = async () => {
    try {
      await UserService.logout();
    } finally {
      localStorage.removeItem("userId"); 
      window.location.href = "/auth";
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Esta ação é irreversível. Tem certeza que deseja apagar a sua conta?")) {
      try {
        await UserService.deleteUser(userId!);
        localStorage.removeItem("userId"); 
        alert("Conta apagada com sucesso.");
        window.location.href = "/auth";
      } catch (error: any) {
        alert(error.message || "Erro ao tentar apagar a conta.");
      }
    }
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
            <label className={styles.label}>E-mail (Fixo)</label>
            <input 
              type="email" 
              className={styles.input} 
              value={email}
              disabled 
              title="O e-mail não pode ser alterado no momento"
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Nova Senha</label>
            <input 
              type="password" 
              className={styles.input} 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="************"
            />
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button type="button" onClick={handleDelete} className={`${styles.btn} ${styles.btnDelete}`}>
            Excluir Conta
          </button>
          
          <div className={styles.rightButtons}>
            <button type="button" onClick={handleLogout} className={`${styles.btn} ${styles.btnLogout}`}>
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