const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
  all(callback) {
    const query = `SELECT * FROM chefs`;

    db.query(query, function (err, results) {
      if (err) throw err;

      callback(results.rows);
    });
  },

  find(id, callback) {
    const query = `SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id`

    db.query(query,[id],function (err, results) {
        if (err) throw err;

        callback(results.rows[0]);
      }
    );
  },

  chefRecipes(id, callback){
    const query = `
        SELECT title, image, recipes.id AS recipe_id
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        ORDER BY recipes.created_at DESC`

    db.query(query, [id], function(err, results){
      if(err) throw err;

      callback(results.rows)
    })
  },

  post(data, callback) {
    const query = `
        INSERT INTO chefs(
            name,
            avatar_url,
            created_at
        )VALUES($1,$2,$3)
        RETURNING id`;

    const values = [data.name, data.avatar_url, date(Date.now()).iso];

    db.query(query, values, function (err, results) {
      if (err) throw err;

      callback(results.rows[0]);
    });
  },
  
  update(data, callback) {
    const query = `UPDATE chefs SET
        name = ($1),
        avatar_url = ($2)
        WHERE id = $3
        `;

    const values = [data.name, data.avatar_url, data.id];

    db.query(query, values, function (err, results) {
      if(err) throw err;

      callback(results.rows[0]);
    })
  },

  delete(id,callback){
    const query = `DELETE FROM chefs WHERE id = $1`

    db.query(query, [id], function (err, results) {
      if(err) throw err;

      callback();
    })
  }
};
