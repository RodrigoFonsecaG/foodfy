const express = require('express');
const routes = express.Router();
const VisitorController = require('../app/controllers/VisitorController.js');

routes.get("/", VisitorController.index);
routes.get("/recipes", VisitorController.recipes);
routes.get("/recipes/:id", VisitorController.showRecipe);
routes.get("/about", VisitorController.about)
routes.get("/chefs", VisitorController.chefs);
routes.get("/chefs/:id", VisitorController.showChef);


module.exports = routes