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

  async register(userData: { email: string; senha: string; username: string; }) {
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
  },

  async updateProfile(userId: string, field: string, newValue: string) {
    const resposta = await fetch(`${USERS_ENDPOINT}/${userId}/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, newValue }),
    });
    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.erro || 'Falha ao atualizar o perfil.');
    }
    return resposta.json();
  },

  async deleteUser(userId: string) {
    const resposta = await fetch(`${USERS_ENDPOINT}/${userId}`, {
      method: 'DELETE',
    });
    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.erro || 'Falha ao excluir conta.');
    }
    return resposta.json();
  },

  async logout() {
    const resposta = await fetch(`${USERS_ENDPOINT}/logout`, { method: 'POST' });
    if (!resposta.ok) {
      console.warn("Aviso: Falha ao fazer logout no servidor, mas limparemos a sessão local.");
    }
    return resposta.json();
  }
};
