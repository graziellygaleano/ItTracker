import pg from 'pg';
import dbConfig from '../config/dbConfig.js'

const { Pool } = pg; 

class DAO {
  constructor() {

    this.pool = new Pool(dbConfig);
  }



  async queryExecutor(query, values = []) {
    try {
      const result = await this.pool.query(query, values);
      return result.rows; 
    } catch (error) {
      const errorMessage = this.handleError(error);
      throw new Error(errorMessage);
    }
  }


  // Executa uma transação com rollback em caso de erro (Atomicidade)
  async transaction(callback) {

    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");


      const result = await callback(client);

      await client.query("COMMIT");
      return result;
    } catch (error) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Falha no rollback:", rollbackError.message);
      }
      throw new Error(this.handleError(error));
    } finally {

      client.release();
    }
  }

  handleError(error) {
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