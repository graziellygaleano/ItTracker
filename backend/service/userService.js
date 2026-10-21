import DAO from '../repositories/dao.js';
import User from '../models/user.js';
import CrudUser from '../repositories/crudUser.js';
import { AppError } from '../middlewares/appError.js';

const db = new DAO();
const crudUser = new CrudUser(db);

export class UserService {
  static async updateProfile(userId, field, newValue) {
    const camposPermitidos = ['name', 'username', 'profession', 'institution'];

    if (!camposPermitidos.includes(field)) {
      throw new AppError(`O campo '${field}' não tem permissão para ser alterado.`, 400);
    }

    const user = await crudUser.findById(Number(userId));
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    user[field] = newValue;

    const sucesso = await crudUser.updateUser(user);
    if (!sucesso) {
      throw new AppError('Falha ao atualizar o perfil.', 500);
    }
  }

  static async authUsername(info, data) {
    const query = 'SELECT "idPerfil" FROM public."Perfil" WHERE "Username" = $1';
    const rows = await db.queryExecutor(query, [info]);

    if (rows && rows.length > 0) {
      throw new AppError('Nome de usuário já cadastrado no sistema.', 409);
    }
  }

  static async getUser(userId) {
    const user = await crudUser.findById(Number(userId));

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    return user;
  }

  static async deleteUser(userId) {
    const deletado = await crudUser.deleteById(Number(userId));
    if (!deletado) {
      throw new AppError('Usuário não encontrado para exclusão.', 404);
    }
  }

  static async register(userdata) {
    const { userType, name, username, email, senha, profession, institution } = userdata;

    const novoUsuario = new User(
      null,
      userType || 1,
      name,
      username,
      email,
      senha,
      profession || null,
      institution || null
    );

    const checkEmail = 'SELECT "idUsuario" FROM public."Usuarios" WHERE "Email" = $1';
    const checkUser = 'SELECT "idPerfil" FROM public."Perfil" WHERE "Username" = $1';
    
    const [emailExists, userExists] = await Promise.all([
      db.queryExecutor(checkEmail, [novoUsuario.emailHash]),
      db.queryExecutor(checkUser, [novoUsuario.username])
    ]);

    if (emailExists.length > 0 || userExists.length > 0) {
      throw new AppError('E-mail ou nome de usuário já existente.', 409);
    }

    await crudUser.createUser(novoUsuario);
  }

 static async autentication(credentials) {
    const { email, senha } = credentials ?? {};

    if (!email || !senha) {
      return false;
    }

    const user = await crudUser.findByCredentials(
      email,
      senha
    );

    return Boolean(user);
  }

  static async logOut() {
    return;
  }
}

 export default UserService; 