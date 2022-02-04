const db = require('../../config/db');

module.exports = {
  post(data) {
    const query = `
        INSERT INTO recipes(
            chef_id,
            title,
            ingredients,
            preparation,
            information,
            user_id
        )VALUES($1,$2,$3,$4,$5,$6)
        RETURNING id`;

    const values = [
      Number(data.chef) || null,
      data.title,
      data.ingredients,
      data.preparations,
      data.information,
      data.user_name || null
    ];

    return db.query(query, values);
  },

  all() {
    const query = `
    SELECT recipes.*, chefs.name AS chef_name, users.name AS user_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    LEFT JOIN users ON (recipes.user_id = users.id)
    ORDER BY recipes.id`;

    return db.query(query);
  },

  find(id) {
    const query = `SELECT recipes.*, chefs.name AS chef_name
  FROM recipes
  LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
  WHERE recipes.id = $1
  ORDER BY recipes.id`;

    return db.query(query, [id]);
  },

  async findUser(id){
    const query = `SELECT recipes.*, users.name AS chef_name
    FROM recipes
    LEFT JOIN users ON (recipes.user_id = users.id)
    WHERE recipes.id = $1
    ORDER BY recipes.id`

    return db.query(query, [id]);
  },

  async allFromUser(id){
    const query = `SELECT recipes.*, users.name AS chef_name
    FROM recipes
    LEFT JOIN users ON (recipes.user_id = users.id)
    WHERE users.id = $1
    ORDER BY recipes.id`

    return db.query(query, [id]);
  },

  update(data) {
    const query = `
  UPDATE recipes SET
  title = ($1),
  chef_id = ($2),
  ingredients = ($3),
  preparation = ($4),
  information = ($5),
  user_id = ($6)
  WHERE id = $7
  `;

    const values = [
      data.title,
      +data.chef || null,
      data.ingredients,
      data.preparations,
      data.information,
      data.user_name || null,
      +data.id
    ];

    return db.query(query, values);
  },

  chefsOptions() {
    const query = `SELECT name,id FROM chefs`;

    return db.query(query);
  },
  
  delete(id) {
    const query = `DELETE FROM recipes WHERE id = $1`;

    return db.query(query, [id]);
  },

  findBy(filter) {
    const query = `
    SELECT recipes.*, chefs.name AS chef_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE recipes.title ILIKE '%${filter}%'
    ORDER BY recipes.updated_at DESC`;

    return db.query(query);
  }
};
