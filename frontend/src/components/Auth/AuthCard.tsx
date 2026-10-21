import React, { useState } from "react";
import styles from "./AuthCard.module.css";
// Removemos a importação do Supabase daqui!

export function AuthCard(): React.JSX.Element {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
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
      // ---------------------------------------------------------
      // FUTURO: Aqui o React vai enviar o E-mail e Senha para o Backend
      // Exemplo: await axios.post('http://localhost:3000/api/login', { email, senha })
      // ---------------------------------------------------------
      console.log(isLogin ? "Simulando Login..." : "Simulando Cadastro...");
      
      // Simulando um tempo de carregamento da API
      setTimeout(() => {
        setMensagem(isLogin ? "Login simulado com sucesso!" : "Cadastro simulado com sucesso!");
        setLoading(false);
      }, 1000);

    } catch (error: any) {
      setMensagem("Erro ao conectar com a API do backend.");
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
            <input type="text" className={styles.input} placeholder="Digite seu nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
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