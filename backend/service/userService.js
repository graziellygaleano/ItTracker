import DAO from '../repositories/dao.js';
import User from '../models/user.js';
import CrudUser from '../repositories/crudUser.js';
import { AppError } from '../middlewares/appError.js';

const db = new DAO();
const crudUser = new CrudUser(db);

export class UserService {
  static async updateProfile(userId, field, newValue) {
    const camposPermitidos = ['name', 'username', 'profession', 'institution', 'passHash'];

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
    const { email, senha, username } = userdata;

    if (!username || !email || !senha) {
      throw new AppError('Nome de usuário, e-mail e senha são obrigatórios.', 400);
    }

    const userType = 1;


    const novoUsuario = new User(
      null,         // idUsuario
      userType,     // TipoUsuario (1)
      username,     // Nome (usando username como fallback)
      username,     // Username
      email,        // Email
      senha         // Senha
    );

    const checkEmail = 'SELECT "idUsuario" FROM public."Usuarios" WHERE "Email" = $1';
    const checkUser = 'SELECT "idPerfil" FROM public."Perfil" WHERE "Username" = $1';
    
    const [emailExists, userExists] = await Promise.all([
      db.queryExecutor(checkEmail, [novoUsuario.email]),
      db.queryExecutor(checkUser, [username])
    ]);

    if (emailExists.length > 0) {
      throw new AppError('Este e-mail já está cadastrado.', 409);
    }

    if (userExists.length > 0) {
      throw new AppError('Este nome de usuário já está em uso.', 409);
    }

    const idGerado = await crudUser.createUser(novoUsuario);
    return idGerado; // Adicione este retorno!
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

    return user;
  }

  static async logOut() {
    return;
  }
}

export default UserService;