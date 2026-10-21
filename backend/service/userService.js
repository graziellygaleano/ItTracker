import DAO from '../repositories/dao.js';
import User from '../models/user.js'
import { AppError } from '../utils/AppError.js';

const db = new DAO();

export class UserService {
  static async updateProfile(userId, field, newValue) {
    const camposPermitidos = ['name', 'username', 'profession', 'institution'];

    if (!camposPermitidos.includes(field)) {
      throw new AppError(`O campo '${field}' não tem permissão para ser alterado.`, 400);
    }

    const query = `UPDATE usuarios SET ${field} = $1 WHERE id = $2`;
    await db.queryExecutor(query, [newValue, userId]);
  }

  static async authUsername(info, data) {
    const query = 'SELECT id FROM usuarios WHERE username = $1';
    const rows = await db.queryExecutor(query, [info]);

    if (rows && rows.length > 0) {
      throw new AppError('Nome de usuário já cadastrado no sistema.', 409);
    }
  }

  static async getUser(userId) {
    const query = `
      SELECT id, user_type, name, username, email, senha, profession, institution 
      FROM usuarios 
      WHERE id = $1
    `;
    const rows = await db.queryExecutor(query, [userId]);

    if (!rows || rows.length === 0) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    const u = rows[0];

    return new User(
      u.id,
      u.user_type,
      u.name,
      u.username,
      u.email,
      u.senha,
      u.profession,
      u.institution
    );
  }

  static async deleteUser(userId) {
    const query = 'DELETE FROM usuarios WHERE id = $1';
    await db.queryExecutor(query, [userId]);
  }

  static async register(userdata) {
    const { userType, name, username, emailHash, passHash, profession, institution } = userdata;

    const novoUsuario = new User(
      null,
      userType || 1,
      name,
      username,
      emailHash,
      passHash,
      profession || null,
      institution || null
    );

    const checkQuery = 'SELECT id FROM usuarios WHERE email = $1 OR username = $2';
    const existentes = await db.queryExecutor(checkQuery, [novoUsuario.emailHash, novoUsuario.username]);

    if (existentes && existentes.length > 0) {
      throw new AppError('E-mail ou nome de usuário já existente.', 409);
    }

    const insertQuery = `
      INSERT INTO usuarios (user_type, name, username, email, senha, profession, institution) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    await db.queryExecutor(insertQuery, [
      novoUsuario.userType,
      novoUsuario.name,
      novoUsuario.username,
      novoUsuario.emailHash,
      novoUsuario.passHash,
      novoUsuario.profession,
      novoUsuario.institution
    ]);
  }

  static async autentication(credencials) {
    const { email, senha } = credencials;

    const query = 'SELECT id, email, senha FROM usuarios WHERE email = $1 AND senha = $2';
    const rows = await db.queryExecutor(query, [email, senha]);

    return Boolean(rows && rows.length > 0);
  }

  static async logOut() {

    return;
  }
}