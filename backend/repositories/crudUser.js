import user from "../models/user.js";

class CrudUser {
    constructor(dao) {
        this.dao = dao;
    }
    async createUser(user) {
        return this.dao.transaction(async client => {
            const perfil = await client.query(
                'INSERT INTO public."Perfil"("idPerfil", "Nome", "Profissao", "Instituicao", "Username") VALUES ($1, $2, $3, $4, $5) RETURNING "idPerfil"',
                [user.username,
                user.name,
                user.profession,
                user.institution,
                user.username
                ]
            );
            const perfilId = perfil.rows[0].idPerfil;
            const usuario = await client.query(
                'INSERT INTO public."Usuarios"("Email","Senha","TipoUsuario","Perfil_idPerfil") VALUES ($1, $2, $3, $4) RETURNING "idUsuario"', [
                user.emailHash,
                user.passHash,
                user.userType,
                perfilId
            ]
            );
            return usuario.rows[0].idUsuario;
        });
    }
    async findById(id) {
        const sql = `
        SELECT u."idUsuario", u."TipoUsuario", u."Email", u."Senha", p."Nome", p."Username", p."Profissao", p."Instituicao", p."idPerfil"
        FROM public."Usuarios" u JOIN public."Perfil" p
        ON p."idPerfil" = u."Perfil_idPerfil"
        WHERE u."idUsuario" = $1`;
        const rows = await this.dao.queryExecutor(sql, [id]);
        if (rows.length === 0) return null;

        const u = rows[0];
        return new User(u.idUsuario, u.TipoUsuario, u.Nome, u.Username, u.Email, u.Senha, u.Profissao, u.Instituicao);
    }
      async updateUser(user) {
            return this.dao.transaction(async client => {
                const usuario = await client.query(
                    `UPDATE public."Usuarios"
         SET "Email" = $1, "Senha" = $2, "TipoUsuario" = $3
         WHERE "idUsuario" = $4
         RETURNING "Perfil_idPerfil"`,
                    [
                        user.emailHash,
                        user.passHash,
                        user.userType,
                        user.userId
                    ]
                );
                if (usuario.rows.length === 0) return 0;

                const perfilId = usuario.rows[0].Perfil_idPerfil;

                await client.query(
                    `UPDATE public."Perfil"
         SET "Nome" = $1,
             "Username" = $2,
             "Profissao" = $3,
             "Instituicao" = $4
         WHERE "idPerfil" = $5`,
                    [
                        user.name,
                        user.username,
                        user.profession,
                        user.institution,
                        perfilId
                    ]
                );

                return 1;
            });
         }
 async deleteById(id) {
                return this.dao.transaction(async client => {
                    const result = await client.query(
                        `DELETE FROM public."Usuarios"
         WHERE "idUsuario" = $1
         RETURNING "Perfil_idPerfil"`,
                        [id]
                    );

                    if (result.rows.length === 0) return 0;

                    const perfilId = result.rows[0].Perfil_idPerfil;

                    await client.query(
                        `DELETE FROM public."Perfil"
         WHERE "idPerfil" = $1`,
                        [perfilId]
                    );
                    return 1;
                });
            }
 }   
            module.exports = CrudUser;