const db = require('../../config/db');
const fs = require('fs')

module.exports = {
  create({ filename, path }) {
    const query = `
        INSERT INTO files(
            name,
            path
        )VALUES($1,$2)
        RETURNING id
        `;

    const values = [filename, path];

    return db.query(query, values);
  },
  async delete(id){
    const result = await db.query(`SELECT * FROM files WHERE id = ${id}`);
    const file = result.rows[0];

    fs.unlinkSync(file.path);

    const query = `
    DELETE FROM files
    WHERE id = ${id}`

    return db.query(query);
  }
};
