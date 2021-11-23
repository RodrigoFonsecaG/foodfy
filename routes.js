const express = require('express');
const routes = express.Router();
const recipes = require('./controllers/recipes.js');

routes.get("/", recipes.home);
routes.get("/recipes", recipes.index);
routes.get("/recipes/:id", recipes.show);

routes.get("/about", (req, res) => {
    return res.render("users/about.njk");
})

//routes.get("/recipes/:index", recipes.show)


/*ADMIN AREA*/
routes.get("/admin/recipes", recipes.indexAdmin);
routes.get("/admin/recipes/create", recipes.create);
routes.get("/admin/recipes/:id", recipes.showAdmin);
routes.get("/admin/recipes/:id/edit", recipes.edit)


routes.post("/admin/recipes", recipes.post);
routes.put("/admin/recipes", recipes.put);
routes.delete("/admin/recipes", recipes.delete);





module.exports = routes;