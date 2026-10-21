class User {
  constructor(userId, userType, name, username, emailHash, passHash, profession, institution) {
    this.userId = userId;
    this.userType = userType;
    this.name = name;
    this.username = username;
    this.emailHash = emailHash;
    this.passHash = passHash;
    this.profession = profession;
    this.institution = institution;
  }
}

export default User;