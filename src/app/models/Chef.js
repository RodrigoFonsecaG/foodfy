const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
  all() {
    const query = `SELECT chefs.*, count(recipes) AS total_recipes
    FROM chefs
    LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
    GROUP BY chefs.id
    `;

    return db.query(query);
  },

  find(id) {
    const query = `SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id
        `

    return db.query(query,[id]);
  },

  async chefRecipes(id){
    const query = `
        SELECT title, recipes.id AS recipe_id
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        ORDER BY recipes.created_at DESC`



   return db.query(query, [id]);
  },

  post(data, fileId) {
    const query = `
        INSERT INTO chefs(
            name,
            created_at,
            file_id
        )VALUES($1,$2,$3)
        RETURNING id`;

    const values = [data.name, date(Date.now()).iso, fileId];

    return db.query(query, values);
  },
  
  update(data, fileId) {
    const query = `UPDATE chefs SET
        name = ($1),
        file_id = ($2)
        WHERE id = $3
        `;

    const values = [data.name, fileId, data.id];

    return db.query(query, values)
  },

  delete(id){
    const query = `DELETE FROM chefs WHERE id = $1`

    return db.query(query, [id])
  }
};
