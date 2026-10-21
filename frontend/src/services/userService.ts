import API_URL from './api.ts';

const USERS_ENDPOINT = `${API_URL}/users`;

export const UserService = {
  async getUser(userId: number | string) {
    const resposta = await fetch(`${USERS_ENDPOINT}/${userId}`);
    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.erro || 'Falha ao obter dados do utilizador');
    }
    return resposta.json();
  },

  async autentication(credenciais: { email: string; senha: string }) {
    const resposta = await fetch(`${USERS_ENDPOINT}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credenciais),
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.erro || 'E-mail ou senha incorretos.');
    }
    return resposta.json();
  },

  async register(userData: { name: string; username: string; email: string; senha: string }) {
    const resposta = await fetch(`${USERS_ENDPOINT}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.erro || 'Falha ao criar conta.');
    }
    return resposta.json();
  }
};