const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer')

const RecipeController = require('../app/controllers/RecipeController.js');
const ChefController = require('../app/controllers/ChefController.js');

const RecipeValidator = require('../app/validators/recipes')

const {onlyAdmin, onlyUser} = require('../app/middlewares/session');


/*ADMIN AREA*/
routes.get("/admin/recipes", onlyUser, RecipeController.index);
routes.get("/admin/recipes/create", onlyUser, RecipeController.create);
routes.get("/admin/recipes/:id", onlyUser, RecipeController.show);
routes.get("/admin/recipes/:id/edit", onlyUser, RecipeController.edit);

const middlewaresPOST = [
    multer.array('photos', 5), 
    RecipeValidator.post
]

const middlewaresPUT = [
    multer.array('photos', 5), 
    RecipeValidator.put
]


routes.post("/admin/recipes", middlewaresPOST, RecipeController.post);
routes.put("/admin/recipes", middlewaresPUT, RecipeController.put);
routes.delete("/admin/recipes", multer.array('photos', 5), RecipeController.delete);


//Chefs
routes.get("/admin/chefs", onlyUser, ChefController.index)
routes.get("/admin/chefs/create", onlyAdmin, ChefController.create)
routes.get("/admin/chefs/:id", onlyUser, ChefController.show);
routes.get("/admin/chefs/:id/edit", onlyAdmin, ChefController.edit);

routes.post("/admin/chefs", multer.array('photos', 1), ChefController.post);
routes.put("/admin/chefs", multer.array('photos', 1), ChefController.update);
routes.delete("/admin/chefs", multer.array('photos', 1), ChefController.delete);


module.exports = routes