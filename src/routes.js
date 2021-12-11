const express = require('express');
const routes = express.Router();
const recipes = require('./app/controllers/recipes.js');
const chefs = require('./app/controllers/chefs.js');
const users = require('./app/controllers/users.js');

routes.get("/", users.index);
routes.get("/recipes", users.recipes);
routes.get("/recipes/:id", users.show);
routes.get("/about", users.about)
routes.get("/chefs", users.chefs);


/*ADMIN AREA*/
routes.get("/admin/recipes", recipes.index);
routes.get("/admin/recipes/create", recipes.create);
routes.get("/admin/recipes/:id", recipes.show);
routes.get("/admin/recipes/:id/edit", recipes.edit)

routes.post("/admin/recipes", recipes.post);
routes.put("/admin/recipes", recipes.put);
routes.delete("/admin/recipes", recipes.delete);


//Chefs
routes.get("/admin/chefs", chefs.index)
routes.get("/admin/chefs/create", chefs.create)
routes.get("/admin/chefs/:id", chefs.show);
routes.get("/admin/chefs/:id/edit", chefs.edit);

routes.post("/admin/chefs", chefs.post);
routes.put("/admin/chefs", chefs.update);
routes.delete("/admin/chefs", chefs.delete);








module.exports = routes;