const Recipe = require('../models/Recipe');

module.exports = {
  create(req, res) {
    Recipe.chefsOptions(function (chefs) {
      return res.render('admin/recipes/create.njk', { chefs });
    });
  },

  index(req, res) {
    const filter = req.query.filter;

    if (filter) {
      Recipe.findBy(filter, function (recipes) {
        return res.render('admin/recipes/index.njk', { recipes, filter });
      });

    } else {
      Recipe.all(function (recipes) {
        return res.render('admin/recipes/index.njk', { recipes });
      });
    }
  },

  post(req, res) {
    const keys = Object.values(req.body);

    for (let key of keys) {
      if (key == '') res.send('Fill in all fields!');
    }

    Recipe.post(req.body, function (recipe) {
      return res.redirect(`/admin/recipes/${recipe.id}`);
    });
  },

  show(req, res) {
    const id = +req.params.id;

    Recipe.find(id, function (recipe) {
      if (!recipe) return res.send('recipe not found!');

      return res.render('admin/recipes/show.njk', { recipe });
    });
  },

  edit(req, res) {
    const id = req.params.id;

    Recipe.find(id, function (recipe) {
      if (!recipe) res.send('Recipe not found!');

      Recipe.chefsOptions(function (chefs) {
        return res.render('admin/recipes/edit.njk', { recipe, chefs });
      });
    });
  },

  put(req, res) {
    console.log(req.body);

    Recipe.update(req.body, function () {
      res.redirect(`/admin/recipes/${req.body.id}`);
    });
  },

  delete(req, res) {
    Recipe.delete(+req.body.id, function () {
      return res.redirect('/admin/recipes');
    });
  }
};
