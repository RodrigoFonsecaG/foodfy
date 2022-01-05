const db = require('../../config/db');

module.exports = {
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
        SELECT recipes.title, recipes.id, chefs.name AS chef_name, ${totalQuery}
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        ${filterQuery}
        ORDER BY recipes.created_at DESC LIMIT $1 OFFSET $2`;

    db.query(query, [limit, offset], function (err, results) {
      if (err) throw err;

      callback(results.rows);
    });
  }
};
