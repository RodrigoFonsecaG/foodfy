const Chef = require('../models/Chef');
const ChefFile = require('../models/ChefFile');
const RecipeFile = require('../models/RecipeFile');
const File = require('../models/File');

module.exports = {
  async index(req, res) {
    try {
      let results = await Chef.all();
      const chefs = results.rows;


      async function getImage(chefId){
        let results = await ChefFile.find(chefId);

        const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public' , '')}`)

        return files[0];
      }

      const chefsPromise = chefs.map(async chef => {
        chef.img = await getImage(chef.file_id);

        return chef
      })

      const lastAdded = await Promise.all(chefsPromise);

      

      return res.render('admin/chefs/index.njk', { chefs: lastAdded });
    } catch (err) {
      console.error(err);
    }
  },

  create(req, res) {
    return res.render('admin/chefs/create.njk');
  },

  async post(req, res) {
    try {
      const keys = Object.values(req.body);

      let results = await File.create(...req.files);
      const { id: fileId } = results.rows[0];

      results = await Chef.post(req.body, fileId);
      const chef = results.rows[0];

      return res.redirect(`/admin/chefs/${chef.id}`);
    } catch (err) {
      console.error(err);
    }
  },

  async show(req, res) {
    try {
      const id = +req.params.id;

      /*chef*/
      let results = await Chef.find(id);
      const chef = results.rows[0];

      results = await ChefFile.find(chef.file_id);
      const file = results.rows[0];

      chef.img = `${req.protocol}://${req.headers.host}${file.path.replace(
        'public',
        ''
      )}
    `;


    /*recipes*/ 

    results = await Chef.chefRecipes(id);
    const recipes = results.rows;

    async function getImage(recipeId){
        let results = await RecipeFile.find(recipeId);

        const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public' , '')}`)

        return files[0];
    }


    const recipesPromise = recipes.map(async recipe => {
      recipe.img = await getImage(recipe.recipe_id);

      return recipe
    })

    const lastAdded = await Promise.all(recipesPromise);


      return res.render('admin/chefs/show.njk', { chef,recipes: lastAdded });
    } catch (err) {
      console.error(err);
    }
  },

  async edit(req, res) {
    try {
      const id = +req.params.id;

      let results = await Chef.find(id);
      const chef = results.rows[0];
      chef.total_recipes = +chef.total_recipes;

      results = await ChefFile.find(chef.file_id);
      const file = results.rows[0];

      return res.render('admin/chefs/edit.njk', { chef, file });
    } catch (err) {
      console.error(err);
    }
  },

  async update(req, res) {
    try {
      const keys = Object.values(req.body);

      for (let key of keys) {
        if (req.body[key] == '' && key != 'removed_files')
          res.send('Fill in all fields!');
      }

      let fileId;

      if (req.files.length != 0) {
        let results = await File.create(...req.files);
        const { id } = results.rows[0];

        fileId = id;
      } else {
        fileId = req.body.file_id;
      }

      await Chef.update(req.body, fileId);

      if (req.body.removed_files) {
        await File.delete(req.body.removed_files);
      }

      return res.redirect(`/admin/chefs/${req.body.id}`);
    } catch (err) {
      console.error(err);
    }
  },

  async delete(req, res) {
    try {
      await Chef.delete(+req.body.id);

      return res.redirect('/admin/chefs');
    } catch (err) {
      console.error(err);
    }
  }
};
