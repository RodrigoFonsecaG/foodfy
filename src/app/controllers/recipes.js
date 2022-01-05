const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

module.exports = {
  async create(req, res) {
    try {
      let results = await Recipe.chefsOptions();

      const chefs = results.rows;

      return res.render('admin/recipes/create.njk', { chefs });
    } catch (err) {
      console.error(err);
    }
  },

  async post(req, res) {
    try {
      const keys = Object.values(req.body);

      for (let key of keys) {
        if (key == '') return res.send('Fill in all fields!');
      }

      // Verificação se foi enviada imagem pelo usuario
      if (req.files.length == 0) {
        return res.send('Please, send at least one image');
      }

      let results = await Recipe.post(req.body);
      const recipe = results.rows[0];

      const filesPromises = req.files.map((file) => File.create({ ...file }));
      const files = await Promise.all(filesPromises);

      // Neste caso pegamos a resposta do await do files, que é o retorno dos ids
      const recipeFilesPromise = files.map((file) =>
        RecipeFile.create(recipe.id, file.rows[0].id)
      );
      await Promise.all(recipeFilesPromise);

      return res.redirect(`/admin/recipes/${recipe.id}`);
    } catch (err) {
      console.error(err);
    }
  },

  async index(req, res) {
    try {
      const filter = req.query.filter;
      let results;

      if(filter){
        results = await Recipe.findBy(filter);
      }
      else{
        results = await Recipe.all();
      }


      const recipes = results.rows;

      async function getImage(recipeId){
        let results = await RecipeFile.find(recipeId);

        const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public' , '')}`)

        return files[0];
      }

      const recipesPromise = recipes.map(async recipe => {
        recipe.img = await getImage(recipe.id);

        return recipe
      })

      const lastAdded = await Promise.all(recipesPromise)

      recipes.total = recipes.length


      return res.render('admin/recipes/index.njk', {recipes: lastAdded, filter});
    } catch (err) {
      console.error(err);
    }
  },

  async show(req, res) {
    try {
      const id = +req.params.id;

      let results = await Recipe.find(id);
      const recipe = results.rows[0];

      results = await RecipeFile.find(id);

      const files = results.rows.map((file) => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          'public',
          ''
        )}`
      }));

      return res.render('admin/recipes/show.njk', { recipe, files });
    } catch (err) {
      console.error(err);
    }
  },

  async edit(req, res) {
    try {
      const id = req.params.id;

      let results = await Recipe.find(id);
      const recipe = results.rows[0];

      results = await Recipe.chefsOptions();
      const chefs = results.rows;

      results = await RecipeFile.find(id);

      const files = results.rows.map((file) => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          'public',
          ''
        )}`
      }));

      return res.render('admin/recipes/edit.njk', { recipe, chefs, files });
    } catch (err) {
      console.error(err);
    }
  },

  async put(req, res) {
    try {
      const keys = Object.keys(req.body);

      for (let key of keys) {
        if (req.body[key] == '' && key != 'removed_files') {
          return res.send('Preencha todos os campos');
        }
      }

      if (req.files.length != 0) {
        const filesPromises = req.files.map((file) => File.create({ ...file }));
        const files = await Promise.all(filesPromises);

        const recipeFilesPromise = files.map((file) =>
          RecipeFile.create(req.body.id, file.rows[0].id)
        );
        await Promise.all(recipeFilesPromise);
      }

      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(',');

        const lastIndex = removedFiles.length - 1;
        removedFiles.splice(lastIndex, 1);

        const removedRecipeFilesPromise = removedFiles.map((id) =>
          RecipeFile.delete(id)
        );
        await Promise.all(removedRecipeFilesPromise);

        const removedFilesPromise = removedFiles.map((id) => File.delete(id));
        await Promise.all(removedFilesPromise);
      }

      await Recipe.update(req.body);

      res.redirect(`/admin/recipes/${req.body.id}`);
    } catch (err) {
      console.error(err);
    }
  },

  async delete(req, res) {
    try {
      const removedFiles = req.body.filesId.split(',');
      const id = req.body.id;

      const lastIndex = removedFiles.length - 1;
      removedFiles.splice(lastIndex, 1);

      const removedRecipeFilesPromise = removedFiles.map((id) =>
        RecipeFile.delete(id)
      );
      await Promise.all(removedRecipeFilesPromise);

      const removedFilesPromise = removedFiles.map((id) => File.delete(id));
      await Promise.all(removedFilesPromise);

      await Recipe.delete(id);
      return res.redirect('/admin/recipes');
    } catch (err) {
      console.error(err);
    }
  }
};
