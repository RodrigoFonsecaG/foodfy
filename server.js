const express = require('express');
const nunjucks = require('nunjucks');
const recipes = require('./data.js');


const server = express();

server.use(express.static("public"));

nunjucks.configure("views", {
    express: server,
    noCache: true
})

server.get("/", (req, res) => {
    return res.render("index.njk", {recipes});
})

server.get("/recipes", (req, res) => {
    return res.render("recipes.njk", {recipes});
})

server.get("/about", (req, res) => {
    return res.render("about.njk");
})

server.get("/recipes/:index", function (req, res) {
    //Pega na url o numero do index
    const recipeIndex = req.params.index;

    // Vai nas receitas e seleciona aquela
    // que tem o mesmo index da url
    const recipe = recipes[recipeIndex]
  
    // Renderiza uma pagina de detalhes da receitas
    // E envia somente a receita que tem o index da url
    return res.render("recipe-details.njk", {recipe});
})

server.listen('3000');