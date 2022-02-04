const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const RecipeFile = require('../models/RecipeFile');
const ChefFile = require('../models/ChefFile');


module.exports = {
  async index(req, res) {
    try {
      const filter = req.query.filter;
      let results;

      if (filter) {
        results = await Recipe.findBy(filter);
      } else {
        results = await Recipe.all();
      }

      const recipes = results.rows;

      async function getImage(recipeId) {
        let results = await RecipeFile.find(recipeId);

        const files = results.rows.map(
          (file) =>
            `${req.protocol}://${req.headers.host}${file.path.replace(
              'public',
              ''
            )}`
        );

        return files[0];
      }

      const recipesPromise = recipes
        .map(async (recipe) => {
          recipe.img = await getImage(recipe.id);

          return recipe;
        })
        .filter((recipe, index) => (index > 5 ? false : true));

      const lastAdded = await Promise.all(recipesPromise);

      recipes.total = recipes.length;

      return res.render('users//index.njk', { recipes: lastAdded, filter });
    } catch (err) {
      console.error(err);
    }
  },

  async recipes(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 6;

    let offset = limit * (page - 1);

    /*imagens*/
    async function getImage(recipeId) {
      let results = await RecipeFile.find(recipeId);

      const files = results.rows.map(
        (file) =>
          `${req.protocol}://${req.headers.host}${file.path.replace(
            'public',
            ''
          )}`
      );

      return files[0];
    }
    /**/

    const params = {
      filter,
      page,
      limit,
      offset,
      async callback(recipes) {
        const pagination = {
          total: Math.ceil(recipes[0].total / limit),
          page,
          limit
        };

        const recipesPromise = recipes.map(async (recipe) => {
          recipe.img = await getImage(recipe.id);

          return recipe;
        });

        const lastAdded = await Promise.all(recipesPromise);


        return res.render('users/recipes.njk', {
          recipes: lastAdded,
          filter,
          pagination
        });
      }
    };

    User.paginate(params);
  },

  async showRecipe(req, res) {
    try {
      const id = +req.params.id;

      let results = await Recipe.find(id);
      let recipe = results.rows[0];

      if(!recipe.chef_name){
        recipe = await Recipe.findUser(id);
      }

      results = await RecipeFile.find(id);

      const files = results.rows.map((file) => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          'public',
          ''
        )}`
      }));

      return res.render('users/show-recipe.njk', { recipe, files });
    } catch (err) {
      console.error(err);
    }
  },

  async showChef(req, res) {
    try {
      const { id } = req.params;

      /*dados*/
      let results = await Chef.find(id);
      const chef = results.rows[0];

      /*imagem do chef*/
      results = await ChefFile.find(chef.file_id);
      const file = results.rows[0];

      chef.img = `${req.protocol}://${req.headers.host}${file.path.replace(
        'public',
        ''
      )}
  `;

      /*informações das receitas do chef*/
      results = await Chef.chefRecipes(id);
      const recipes = results.rows;

      /*imagens das receitas do chef*/
      async function getImage(recipeId) {
        let results = await RecipeFile.find(recipeId);

        const files = results.rows.map(
          (file) =>
            `${req.protocol}://${req.headers.host}${file.path.replace(
              'public',
              ''
            )}`
        );

        return files[0];
      }

      const recipesPromise = recipes.map(async (recipe) => {
        recipe.img = await getImage(recipe.recipe_id);

        return recipe;
      });

      const lastAdded = await Promise.all(recipesPromise);

      return res.render('users/show-chef.njk', { chef, recipes: lastAdded });
    } catch (err) {
      console.error(err);
    }
  },

  about(req, res) {
    return res.render('users/about.njk');
  },

  async chefs(req, res) {
    try {
      let results = await Chef.all();
      const chefs = results.rows;

      async function getImage(chefId) {
        let results = await ChefFile.find(chefId);

        const files = results.rows.map(
          (file) =>
            `${req.protocol}://${req.headers.host}${file.path.replace(
              'public',
              ''
            )}`
        );

        return files[0];
      }

      const chefsPromise = chefs.map(async (chef) => {
        chef.img = await getImage(chef.file_id);

        return chef;
      });

      const lastAdded = await Promise.all(chefsPromise);

      return res.render('users/chefs.njk', { chefs: lastAdded });
    } catch (err) {
      console.error(err);
    }
  }
};
