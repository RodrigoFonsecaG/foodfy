const Chef = require('../models/Chef');
const { post, show } = require('./recipes');

module.exports = {
    index(req, res){
        Chef.all(function(chefs){
            return res.render("admin/chefs/index.njk", {chefs})
        })
        
    },
    create(req, res){
        return res.render("admin/chefs/create.njk")
    },
    post(req,res){
        const keys = Object.values(req.body);

        for (let key of keys) {
          if (key == '') res.send('Fill in all fields!');
        }


        Chef.post(req.body, function(chef){
           return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },
    show(req,res){
        const id = +req.params.id;

        Chef.find(id, function(chef){
            if(!chef) return res.send("Chef not found!");

            Chef.chefRecipes(id, function(recipes){
                return res.render('admin/chefs/show.njk', {chef, recipes})
        })
    
        })
    },
    edit(req,res){
        const id = +req.params.id;

        Chef.find(id, function(chef){
            if(!chef) return res.send("Chef not found!")

            chef.total_recipes = +chef.total_recipes

            console.log(chef)

            return res.render('admin/chefs/edit.njk', {chef});
        })
    },
    update(req, res){
        const keys = Object.values(req.body);

        for (let key of keys) {
          if (key == '') res.send('Fill in all fields!');
        }

        Chef.update(req.body, function(chef){
            res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },
    delete(req,res){
     
        Chef.delete(+req.body.id, function(){
            return res.redirect("/admin/chefs")
        })
    }
}