const db = require('../../config/db');
const {hash} = require('bcryptjs')
const mailer = require('../../lib/mailer')
const RecipeFile = require('../models/RecipeFile');
const File = require('../models/File');
const fs = require('fs');

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
  },
  async all(){
    const query = `SELECT * FROM users`

    const results = await db.query(query);

    return results.rows;
  },
  async findOne(filters) {
    let query = `SELECT * FROM users`;

    Object.keys(filters).map((key) => {
      query = `${query} 
            ${key}`;

      Object.keys(filters[key]).map((field) => {
        query = `${query} ${field} = '${filters[key][field]}'`;
      });
    });

    const results = await db.query(query);

    return results.rows[0];
  },
  async post(data){
    const query = `INSERT INTO users(
      name,
      email,
      password,
      is_admin
    ) VALUES($1,$2,$3,$4)
    RETURNING id`

    const randomPassword = (Math.random() * (1000000000 -10000000) + 10000000).toString().replace('.',"");


    //enviando para o usuario sua senha:
    await mailer.sendMail({
      to: data.email,
      from: 'contato@foodfy.com',
      subject: 'Senha foodfy',
      html: `<h2>Sua senha foodfy foi criada</h2>
      <p>Sua senha é: ${randomPassword}, use-a junto com o seu email para logar no foodfy</p>`
    })

    const passwordHash = await hash(randomPassword, 8);

    const values = [
      data.name,
      data.email,
      passwordHash,
      data.is_admin || 0
    ]

    const results = await db.query(query, values);

    return results.rows[0].id;
  },
  async update(id, fields){
    let query = `UPDATE users SET`

    Object.keys(fields).map((key,index,array) => {
      if((index+1) < array.length) {
        query = `${query}
        ${key} =  '${fields[key]}',
        `    
      }else{
        query = `${query}
        ${key} =  '${fields[key]}'
        WHERE id = ${id}
        `    
      }
    })


    await db.query(query);
},
async delete(id){
  let results = await db.query('SELECT * FROM recipes WHERE user_id = $1', [id]);
  const recipes = results.rows;

  

  const recipeFilesPromise = recipes.map((recipe) => RecipeFile.find(recipe.id));
  const recipeFilesPromiseResolved = await Promise.all(recipeFilesPromise);

const removedFilesPromise = recipeFilesPromiseResolved.map((files) => {
  
  files.rows.map(file => File.delete(file.id))
});

await Promise.all(removedFilesPromise);

await db.query('DELETE FROM users WHERE id = $1', [id]);


}
};
