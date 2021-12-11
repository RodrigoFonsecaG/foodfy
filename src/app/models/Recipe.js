const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
post(data, callback) {

    const query = `
        INSERT INTO recipes(
            chef_id,
            image,
            title,
            ingredients,
            preparation,
            information,
            created_at
        )VALUES($1,$2,$3,$4,$5,$6,$7)
        RETURNING id`;

    const values = [
    data.chef,
    data.image,
    data.title,
    data.ingredients,
    data.preparations,
    data.information,
    date(Date.now()).iso
    ];

    db.query(query, values, function (err, results) {
      if (err) throw err;

      callback(results.rows[0]);
    });
},

all(callback) {
  const query = `
  SELECT recipes.*, chefs.name AS chef_name
  FROM recipes
  LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
  ORDER BY recipes.id`;

  db.query(query, function (err, results) {
    if (err) throw err;

    callback(results.rows);
  });
},

find(id, callback) {
  db.query(
    `SELECT recipes.*, chefs.name AS chef_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE recipes.id = $1
    ORDER BY recipes.id`,
    [id],
    function (err, results) {
      if (err) throw err;

      callback(results.rows[0]);
    }
  );
},

update(data, callback){
  const query = `
  UPDATE recipes SET
  title = ($1),
  chef_id = ($2),
  image = ($3),
  ingredients = ($4),
  preparation = ($5),
  information = ($6)
  WHERE id = $7
  `;   

  const values = [
    data.title,
    +data.chef,
    data.image,
    data.ingredients,
    data.preparations,
    data.information,
    data.id
  ] 

  db.query(query, values, function(err, results){
    if(err) throw err

    callback();
  })
},

chefsOptions(callback){
 const query = `SELECT name,id FROM chefs`

 db.query(query, function (err, results){
   if(err) throw err;

   callback(results.rows)
 })
},

delete(id,callback){
    const query = `DELETE FROM recipes WHERE id = $1`

    db.query(query, [id], function (err, results) {
      if(err) throw err;

      callback();
    })
  },
  findBy(filter,callback){
    const query = `
    SELECT recipes.*, chefs.name AS chef_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE recipes.title ILIKE '%${filter}%'
    ORDER BY recipes.id`;

    db.query(query, function(err, results){
        if(err) throw err

        callback(results.rows)
    })
}
}