import React, { useState } from "react";
import styles from "./AuthCard.module.css";
import { UserService } from "../../services/userService";

export function AuthCard(): React.JSX.Element {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [username, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMensagem("");
    setNome("");
    setSenha("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    try {
      if (isLogin) {
        const resposta = await UserService.autentication({ email, senha });
        
        localStorage.setItem("userId", resposta.idUsuario); 

        setMensagem("Sessão iniciada com sucesso!");
        
        setTimeout(() => {
          window.location.href = "/forum";
        }, 1000);

      } else {
        await UserService.register({ email, senha, username });
        setMensagem("Conta criada com sucesso! Faça login para continuar.");
        
        setTimeout(() => {
          setIsLogin(true);
          setMensagem("");
          setNome("");
          setSenha("");
        }, 1500);
      }
    } catch (error: any) {
      setMensagem(error.message || "Erro ao conectar com a API do backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.titulo}>{isLogin ? "Acessar Conta" : "Criar Conta"}</h1>

      {mensagem && (
        <div style={{ marginBottom: "1rem", color: mensagem.includes("sucesso") ? "green" : "red", fontWeight: "bold" }}>
          {mensagem}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        {!isLogin && (
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nome Completo</label>
            <input type="text" className={styles.input} placeholder="Digite seu nome" value={username} onChange={(e) => setNome(e.target.value)} required />
          </div>
        )}

        <div className={styles.inputGroup}>
          <label className={styles.label}>E-mail</label>
          <input type="email" className={styles.input} placeholder="Digite seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Senha</label>
          <input type="password" className={styles.input} placeholder="Digite sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>

        <button type="submit" className={styles.btnSubmit} disabled={loading}>
          {loading ? "A processar..." : (isLogin ? "Entrar" : "Cadastrar")}
        </button>
      </form>

      <p className={styles.toggleText}>
        {isLogin ? "Ainda não possui conta? " : "Já possui uma conta? "}
        <button type="button" onClick={toggleMode} className={styles.toggleButton}>
          {isLogin ? "Cadastre-se aqui" : "Faça login"}
        </button>
      </p>
    </div>
  );
}