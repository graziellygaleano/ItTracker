// Arquivo: backend/repositories/DAO.js
import pg from 'pg';
import dbConfig from '../config/dbConfig.js'

const { Client } = pg;

class DAO {
  constructor() {
    // Injeta a configuração importada diretamente no cliente do banco
    this.client = new Client(dbConfig);
  }

  async connect() {
    try {
      await this.client.connect(); 
      console.log('Conectado ao banco de dados Supabase com sucesso!');
    } catch (error) {
      console.error('Falha ao conectar no Supabase:', error.message);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log('Desconectado do banco de dados.');
    } catch (error) {
      console.error('Falha ao desconectar:', error.message);
    }
  }


  async queryExecutor(query, values = []) {
    try {
      const result = await this.client.query(query, values);
      return result.rows; // Retorna os dados encontrados
    } catch (error) {
      const errorMessage = this.handleError(error);
      throw new Error(errorMessage);
    }
  }



  // + handleError(error) : string
  handleError(error) {
    // Mapeamento de códigos de erro padrão do PostgreSQL/Supabase
    if (error.code === '28P01') {
      return 'Erro de autenticação: Senha ou usuário do banco incorretos.';
    }
    if (error.code === '23505') {
      return 'Conflito: Este registro já existe no banco de dados.';
    }
    if (error.code === '23503') {
      return 'Violação de restrição: Este registro está vinculado a outros dados.';
    }
    if (error.code === '42P01') {
      return 'Erro de sintaxe: A tabela solicitada não existe no Supabase.';
    }

    return `Erro interno do banco de dados: ${error.message}`;
  }
}

export default DAO;