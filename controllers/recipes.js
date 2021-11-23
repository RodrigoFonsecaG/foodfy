const fs = require('fs');
const data = require('../data.json');

exports.home = (req, res) => {
  return res.render('users/home.njk', { recipes: data.recipes });
};

exports.index = (req, res) => {
  return res.render('users/index.njk', { recipes: data.recipes });
};

exports.show = (req, res) => {
  //Pega na url o numero do index
  const recipeId = req.params.id
  const foundRecipe = data.recipes.find(recipe => recipe.id == recipeId);

  return res.render("users/show.njk", {recipe: foundRecipe})
};

/*AREA ADMIN */

exports.create = (req, res) => {
  return res.render('admin/create.njk');
};

exports.post = (req, res) => {
  const { title, author, image, ingredients, preparations, information } =
    req.body;

  const keys = Object.values(req.body);

  for (let key of keys) {
    if (key == '') res.send('Fill in all fields!');
  }

  /*ID UNICO */
  let id = 1;
  let lastMember = data.recipes[data.recipes.length - 1];
  if(lastMember) id = lastMember.id + 1;


  data.recipes.push({
    id,
    title,
    author,
    image,
    ingredients,
    preparations,
    information
  });


  fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
    if (err) return console.error(err);

    return res.redirect('/admin/recipes');
  });
};

exports.indexAdmin = (req, res) => {

  return res.render('admin/index.njk', {recipes: data.recipes});
};

exports.showAdmin = (req, res) => {
  //Pega na url o numero do index
  const recipeId = req.params.id
  const foundRecipe = data.recipes.find(recipe => recipe.id == recipeId);

  return res.render("admin/show.njk", {recipe: foundRecipe})
};

exports.edit = (req, res) => {
  const recipeId = req.params.id

  const foundRecipe = data.recipes.find(recipe => recipe.id == recipeId);

  return res.render('admin/edit.njk', {recipe: foundRecipe})
}

exports.put = (req, res) => {
  const {id} = req.body
  let index = 0;
  
  const foundRecipe = data.recipes.find((recipe, foundIndex) =>{ 
    index = foundIndex;
    return recipe.id == id
  });

  const recipes = {
    ...foundRecipe,
    ...req.body,
    id: +req.body.id
  }


  data.recipes[index] = recipes;

  
  fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
    if (err) return console.error(err);

    return res.redirect(`/admin/recipes/${id}`);
  });
}

exports.delete = (req, res) => {
  const {id} = req.body
  
  const recipes = data.recipes.filter((recipe) => {
    return recipe.id != id
  })

  data.recipes = recipes;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
    if (err) return console.error(err);

    return res.redirect('/admin/recipes');
  });
}
