const express = require('express');
const routes = express.Router();
const multer = require('./app/middlewares/multer')


const recipes = require('./app/controllers/recipes.js');
const chefs = require('./app/controllers/chefs.js');
const users = require('./app/controllers/users.js');

routes.get("/", users.index);
routes.get("/recipes", users.recipes);
routes.get("/recipes/:id", users.showRecipe);
routes.get("/about", users.about)
routes.get("/chefs", users.chefs);
routes.get("/chefs/:id", users.showChef);



/*ADMIN AREA*/
routes.get("/admin/recipes", recipes.index);
routes.get("/admin/recipes/create", recipes.create);
routes.get("/admin/recipes/:id", recipes.show);
routes.get("/admin/recipes/:id/edit", recipes.edit)


routes.post("/admin/recipes", multer.array('photos', 5), recipes.post);
routes.put("/admin/recipes", multer.array('photos', 5), recipes.put);
routes.delete("/admin/recipes", multer.array('photos', 5), recipes.delete);


//Chefs
routes.get("/admin/chefs", chefs.index)
routes.get("/admin/chefs/create", chefs.create)
routes.get("/admin/chefs/:id", chefs.show);
routes.get("/admin/chefs/:id/edit", chefs.edit);

routes.post("/admin/chefs", multer.array('photos', 1), chefs.post);
routes.put("/admin/chefs", multer.array('photos', 1), chefs.update);
routes.delete("/admin/chefs", multer.array('photos', 1), chefs.delete);








module.exports = routes;