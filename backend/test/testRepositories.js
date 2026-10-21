
import assert from "node:assert/strict";

import DAO from "../repositories/dao.js";
import CrudUser from "../repositories/crudUser.js";
import CrudTag from "../repositories/crudTag.js";
import CrudComment from "../repositories/crudComment.js";

import User from "../models/user.js";

const dao = new DAO();

const users = new CrudUser(dao);
const tags = new CrudTag(dao);
const comments = new CrudComment(dao);

const resultado = {
  passou: 0,
  falhou: 0
};

const ids = {
  user: null,
  tag: null,
  post: null,
  reply: null
};

const sufixo = `${Date.now()}_${Math.random()
  .toString(36)
  .slice(2, 8)}`;

const userTeste = new User(
  null,
  0,
  "Usuario Teste",
  `teste_${sufixo}`,
  `teste_${sufixo}@example.com`,
  "hash_de_teste_nao_utilizar_em_producao",
  "Desenvolvedor",
  "Instituicao Teste"
);

async function testar(nome, callback) {
  try {
    await callback();
    resultado.passou++;
    console.log(`✅ PASSOU: ${nome}`);
  } catch (error) {
    resultado.falhou++;
    console.error(`❌ FALHOU: ${nome}`);
    console.error(`   ${error.message}`);
  }
}

async function executar() {
  try {
    await dao.connect();

    console.log("\n========== TESTES DOS REPOSITORIES ==========\n");

    // =========================================
    // USER
    // =========================================

    await testar("User - createUser", async () => {
      ids.user = await users.createUser(userTeste);

      assert.ok(ids.user, "O ID do usuário não foi retornado.");
    });

    await testar("User - findById", async () => {
      assert.ok(ids.user, "Pré-requisito: usuário criado.");

      const user = await users.findById(ids.user);

      assert.ok(user, "Usuário não encontrado.");
      assert.equal(user.userId, ids.user);
      assert.equal(user.username, userTeste.username);
    });

    await testar("User - findById inexistente", async () => {
      const user = await users.findById(-999999);

      assert.equal(user, null);
    });

    await testar("User - listAll", async () => {
      const lista = await users.listAll();

      assert.ok(Array.isArray(lista));
      assert.ok(
        lista.some(user => user.userId === ids.user),
        "O usuário criado não aparece na lista."
      );
    });

    await testar("User - updateUser", async () => {
      assert.ok(ids.user, "Pré-requisito: usuário criado.");

      const atualizado = new User(
        ids.user,
        0,
        "Usuario Teste Atualizado",
        userTeste.username,
        userTeste.emailHash,
        userTeste.passHash,
        "Analista de Sistemas",
        "Instituicao Atualizada"
      );

      const alterados = await users.updateUser(atualizado);

      assert.ok(alterados > 0, "Nenhum usuário foi atualizado.");

      const encontrado = await users.findById(ids.user);

      assert.equal(encontrado.name, atualizado.name);
      assert.equal(encontrado.profession, atualizado.profession);
    });

    // =========================================
    // TAG
    // =========================================

    await testar("Tag - createTag", async () => {
      ids.tag = await tags.createTag({
        tagname: `tag_teste_${sufixo}`
      });

      assert.ok(ids.tag, "O ID da tag não foi retornado.");
    });

    await testar("Tag - findByName", async () => {
      const nome = `tag_teste_${sufixo}`;
      const encontrados = await tags.findByName(nome);

      assert.ok(Array.isArray(encontrados));
      assert.ok(
        encontrados.some(tag => tag.tagId === ids.tag),
        "Tag criada não encontrada."
      );
    });

    await testar("Tag - findAll", async () => {
      const lista = await tags.findAll();

      assert.ok(Array.isArray(lista));
      assert.ok(lista.some(tag => tag.tagId === ids.tag));
    });

    // =========================================
    // COMMENT / POST
    // =========================================

    await testar("Comment - createComment (post)", async () => {
      assert.ok(ids.user, "Pré-requisito: usuário criado.");

      ids.post = await comments.createComment({
        commentType: "post",
        authorId: ids.user,
        content: `Post de teste ${sufixo}`,
        commentDate: new Date(),
        hasReplys: false,
        rootPostID: null
      });

      assert.ok(ids.post, "O ID do post não foi retornado.");
    });

    await testar("Comment - findById (post)", async () => {
      const post = await comments.findById(ids.post);

      assert.ok(post, "Post não encontrado.");
      assert.equal(post.commentID, ids.post);
      assert.equal(post.content, `Post de teste ${sufixo}`);
    });

    await testar("Comment - findById inexistente", async () => {
      const post = await comments.findById(-999999);

      assert.equal(post, null);
    });

    await testar("Comment - findAll", async () => {
      const lista = await comments.findAll();

      assert.ok(Array.isArray(lista));
      assert.ok(lista.some(post => post.commentID === ids.post));
    });

    // =========================================
    // COMMENT / REPLY
    // =========================================

    await testar("Comment - createComment (resposta)", async () => {
      ids.reply = await comments.createComment({
        commentType: "resposta",
        authorId: ids.user,
        content: `Resposta de teste ${sufixo}`,
        commentDate: new Date(),
        hasReplys: false,
        rootPostID: ids.post
      });

      assert.ok(ids.reply, "O ID da resposta não foi retornado.");
    });

    await testar("Comment - findById (resposta)", async () => {
      const reply = await comments.findById(ids.reply, "resposta");

      assert.ok(reply, "Resposta não encontrada.");
      assert.equal(reply.commentID, ids.reply);
      assert.equal(reply.rootPostID, ids.post);
    });

    await testar("Comment - getReply", async () => {
      const replies = await comments.getReply(ids.post);

      assert.ok(Array.isArray(replies));
      assert.ok(
        replies.some(reply => reply.commentID === ids.reply),
        "Resposta criada não encontrada."
      );
    });

    // =========================================
    // EXCLUSÕES
    // =========================================

    await testar("Comment - deleteById (resposta)", async () => {
      const removidos = await comments.deleteById(
        ids.reply,
        "resposta"
      );

      assert.equal(removidos, 1);

      const reply = await comments.findById(ids.reply, "resposta");
      assert.equal(reply, null);

      ids.reply = null;
    });

    await testar("Comment - deleteById (post)", async () => {
      const removidos = await comments.deleteById(ids.post);

      assert.equal(removidos, 1);

      const post = await comments.findById(ids.post);
      assert.equal(post, null);

      ids.post = null;
    });

    await testar("Tag - deleteById", async () => {
      const removidos = await tags.deleteById(ids.tag);

      assert.equal(removidos, 1);

      const lista = await tags.findAll();
      assert.ok(!lista.some(tag => tag.tagId === ids.tag));

      ids.tag = null;
    });

    await testar("User - deleteById", async () => {
      const removidos = await users.deleteById(ids.user);

      assert.equal(removidos, 1);

      const user = await users.findById(ids.user);
      assert.equal(user, null);

      ids.user = null;
    });
  } catch (error) {
    console.error("\nErro ao inicializar a suíte:", error.message);
    resultado.falhou++;
  } finally {
    // Limpeza de segurança para registros que sobraram
    // porque algum teste falhou antes da exclusão normal.
    if (dao.connected) {
      if (ids.post) {
        try {
          await comments.deleteById(ids.post);
          ids.post = null;
          ids.reply = null;
        } catch (error) {
          console.error("Falha ao limpar post de teste:", error.message);
        }
      }

      if (ids.reply) {
        try {
          await comments.deleteById(ids.reply, "resposta");
          ids.reply = null;
        } catch (error) {
          console.error("Falha ao limpar resposta:", error.message);
        }
      }

      if (ids.tag) {
        try {
          await tags.deleteById(ids.tag);
          ids.tag = null;
        } catch (error) {
          console.error("Falha ao limpar tag:", error.message);
        }
      }

      if (ids.user) {
        try {
          await users.deleteById(ids.user);
          ids.user = null;
        } catch (error) {
          console.error("Falha ao limpar usuário:", error.message);
        }
      }

      await dao.disconnect();
    }

    console.log("\n========== RESUMO ==========");
    console.log(`Passou: ${resultado.passou}`);
    console.log(`Falhou: ${resultado.falhou}`);
    console.log("============================\n");

    if (resultado.falhou > 0) {
      process.exitCode = 1;
    }
  }
}

executar();
