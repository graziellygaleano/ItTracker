import Tag from "../models/tag.js";

class CrudTag {
  constructor(dao) {
    this.dao = dao;
  }

  async createTag(tag) {
    const sql = `
      INSERT INTO public."Tags" ("TipoTag")
      VALUES ($1)
      RETURNING "idTag"
    `;

    const rows = await this.dao.queryExecutor(sql, [
      tag.tagname
    ]);

    return rows[0].idTag;
  }

  async findByName(name) {
    const sql = `
      SELECT "idTag", "TipoTag"
      FROM public."Tags"
      WHERE "TipoTag" = $1
      ORDER BY "idTag"
    `;

    const rows = await this.dao.queryExecutor(sql);

    return rows
      .filter(t => t.TipoTag === name)
      .map(t => new Tag(t.TipoTag, t.idTag));
  }

  async findAll() {
    const sql = `
      SELECT "idTag", "TipoTag"
      FROM public."Tags"
      ORDER BY "idTag"
    `;

    const rows = await this.dao.queryExecutor(sql);

    return rows.map(t => new Tag(t.TipoTag, t.idTag));
  }

  async deleteById(id) {
    const sql = `
      DELETE FROM public."Tags"
      WHERE "idTag" = $1
      RETURNING "idTag"
    `;

    const rows = await this.dao.queryExecutor(sql, [id]);

    return rows.length;
  }
}

export default CrudTag;