import { User } from '../models/user.js';

export class UserService {

  createUser(userData) {
    const newUser = new User(
      userData.userId,
      userData.email,
      userData.username,
      userData.name,
      userData.profession,
      userData.institution,
      userData.userType
    );

    console.log(`Utilizador ${newUser.username} criado com sucesso!`);
    
    return newUser;
  }

  updateProfile(userId, field, newValue) {
    const user = this.getUser(userId);

    if (!user) {
      console.log(`Usuário com ID ${userId} não encontrado.`);
      return false;
    }

    if (field in user) {
      user[field] = newValue;
      console.log(`Perfil do usuário ${userId} atualizado: ${field} = ${newValue}`);
      return true;
    } else {
      console.log(`O campo '${field}' não existe no perfil do usuário.`);
      return false;
    }
  }

  authenticateUsername(info, data) {
    console.log(`A autenticar username com info: ${info} e dados: ${data}`);
  }


  getUser(userId) {

    // Precisa do repository
  }

  deleteUser(userId) {
    // Precisa do repository
  }
}