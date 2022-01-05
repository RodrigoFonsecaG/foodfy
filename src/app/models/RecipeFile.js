const db = require('../../config/db');

module.exports = {
  create(recipeId, fileId) {
    const query = `
        INSERT INTO recipes_files(
            recipe_id,
            file_id
            )VALUES ($1,$2)
        `;

    const values = [recipeId, fileId];

    return db.query(query, values);
  },
  find(id) {
    const query = `
    SELECT files.*, recipes_files.recipe_id
    FROM files
    LEFT JOIN recipes_files ON (files.id = recipes_files.file_id)
    WHERE recipe_id = ${id}
    `;

    return db.query(query)
  },
  all(){
    const query = `
    SELECT files.*, recipes_files.recipe_id
    FROM files
    LEFT JOIN recipes_files ON (files.id = recipes_files.file_id)
    `;

    return db.query(query);
  },
  delete(id){
    const query = `DELETE FROM recipes_files WHERE file_id = ${id}`

    return db.query(query);
  }
};
