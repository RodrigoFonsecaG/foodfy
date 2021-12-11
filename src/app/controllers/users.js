const User = require('../models/User')

module.exports = {
    index(req, res){
      let filter = req.query.filter;

      if(filter){
        User.findBy(filter, function(recipes){
          return res.render('users/recipes.njk', {recipes, filter})
        })
      }
      else{
      User.show(function(recipes) {
         return res.render('users/index.njk', {recipes});
      })  


    }
    },
    
    recipes(req, res){
      let {filter, page, limit} = req.query;

      page = page || 1;
      limit = limit || 3;

      let offset = limit * (page - 1);

      const params = {
        filter,
        page,
        limit,
        offset,
        callback(recipes){
          const pagination = {
            total: Math.ceil(recipes[0].total / limit),
            page,
            limit
          }
          return res.render("users/recipes.njk", {recipes, filter, pagination})
        }
      }

      User.paginate(params)
    },
    
    show(req, res){
      //Pega na url o numero do index
      const id = req.params.id
    
      User.find(id, function(recipe){
        return res.render("users/show.njk", {recipe})
      })
      
    },

    about(req, res){
        return res.render("users/about.njk");
    },

    chefs(req, res){
      User.chefs(function(chefs) {
        return res.render("users/chefs.njk", {chefs});
      })
    }
}