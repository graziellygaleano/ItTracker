import User from "../models/user.js";

class CrudUser {
    constructor(dao) {
        this.dao = dao;
    }

    async createUser(user) {
        return this.dao.transaction(async client => {
            
            const usuarioResult = await client.query(
                'INSERT INTO public."Usuarios"("Email", "Senha", "TipoUsuario") VALUES ($1, $2, $3) RETURNING "idUsuario"',
                [
                    user.email || user.emailHash,
                    user.senha || user.passHash,
                    user.userType ?? 0 // Salva o tipo de usuário ou usa 0 como padrão
                ]
            );

            const idGerado = usuarioResult.rows[0].idUsuario;

            // 2. Insere na tabela Perfil apenas com os dados básicos necessários
            await client.query(
                'INSERT INTO public."Perfil"("idPerfil", "Nome", "Username") VALUES ($1, $2, $3)',
                [
                    idGerado,
                    user.name || user.username, // Garante um valor para o Nome caso venha apenas o username
                    user.username
                ]
            );

            return idGerado;
        });
    }

    async findById(id) {
        const sql = `
            SELECT u."idUsuario", u."TipoUsuario", u."Email", u."Senha", 
                   p."Nome", p."Username", p."Profissao", p."Instituicao", p."idPerfil"
            FROM public."Usuarios" u 
            JOIN public."Perfil" p ON p."idPerfil" = u."idUsuario"
            WHERE u."idUsuario" = $1
        `;
        
        const rows = await this.dao.queryExecutor(sql, [id]);
        if (rows.length === 0) return null;

        const u = rows[0];
        return new User(
            u.idUsuario, 
            u.TipoUsuario, 
            u.Nome, 
            u.Username, 
            u.Email, 
            u.Senha, 
            u.Profissao, 
            u.Instituicao
        );
    }
    
    async findByCredentials(email, senha) {
        const sql = `
            SELECT "idUsuario"
            FROM public."Usuarios"
            WHERE "Email" = $1 AND "Senha" = $2
            LIMIT 1
        `;
        
        const rows = await this.dao.queryExecutor(sql, [email, senha]);
        
        return rows.length > 0 ? rows[0] : null;
    }

    async updateUser(user) {
        return this.dao.transaction(async client => {
            const usuario = await client.query(
                `UPDATE public."Usuarios"
                 SET "Email" = $1, "Senha" = $2, "TipoUsuario" = $3
                 WHERE "idUsuario" = $4
                 RETURNING "idUsuario"`,
                [
                    user.emailHash,
                    user.passHash,
                    user.userType,
                    user.userId
                ]
            );
            
            if (usuario.rows.length === 0) return 0;

            await client.query(
                `UPDATE public."Perfil"
                 SET "Nome" = $1, "Username" = $2, "Profissao" = $3, "Instituicao" = $4
                 WHERE "idPerfil" = $5`,
                [
                    user.name,
                    user.username,
                    user.profession,
                    user.institution,
                    user.userId 
                ]
            );

            return 1;
        });
    }

    async deleteById(id) {
        const sql = `DELETE FROM public."Usuarios" WHERE "idUsuario" = $1 RETURNING "idUsuario"`;
        const rows = await this.dao.queryExecutor(sql, [id]);
        
        return rows.length > 0 ? 1 : 0;
    }
}

export default CrudUser;