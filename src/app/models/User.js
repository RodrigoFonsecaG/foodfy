const db = require('../../config/db');

module.exports = {
  find(id, callback) {
    const query = `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE recipes.id = $1
        `;

    db.query(query, [id], function (err, results) {
      if (err) throw err;

      callback(results.rows[0]);
    });
  },

  show(callback) {
    const query = `
        SELECT recipes.image,recipes.title, recipes.id, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        ORDER BY recipes.id ASC`;

    db.query(query, function (err, results) {
      if (err) throw err;

      callback(results.rows);
    });
  },

  chefs(callback) {
    const query = `
        SELECT chefs.name, chefs.avatar_url, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id`;

    db.query(query, function (err, results) {
      if (err) throw err;

      callback(results.rows);
    });
  },

  findBy(filter, callback) {
    const query = ` 
        SELECT recipes.image,recipes.title, recipes.id, chefs.name
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY recipes.created_at DESC`;

    db.query(query, function (err, results) {
      if (err) throw err;

      callback(results.rows);
    });
  },
  paginate(params) {
    const { filter, limit, offset, callback } = params;

    let query = '',
      filterQuery = '',
      totalQuery = '(SELECT count(*) FROM recipes) AS total';

    if (filter) {
      filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`;

      totalQuery = `(
                SELECT count(*) FROM recipes 
                ${filterQuery}
                )AS total`;
    }

    query = ` 
        SELECT recipes.image,recipes.title, recipes.id, chefs.name AS chef_name, ${totalQuery}
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        ${filterQuery}
        ORDER BY recipes.id ASC LIMIT $1 OFFSET $2`;

    db.query(query, [limit, offset], function (err, results) {
      if (err) throw err;

      callback(results.rows);
    });
  }
};
