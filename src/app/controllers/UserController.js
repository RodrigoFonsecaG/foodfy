const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const RecipeFile = require('../models/RecipeFile');
const ChefFile = require('../models/ChefFile');


module.exports = {
    create(req,res) {
        return res.render('admin/session/create.njk')
    },
    async post(req,res){
        try{
           await User.post(req.body)

           return res.render("admin/session/create.njk", {sucess: "O cadastro foi concluído com sucesso!"})
           
        }catch(err){
            console.error(err)
            return res.render("admin/session/create.njk", {error: "Erro inesperado ao cadastrar usuário, tente novamente!"})
        }
    },
    async list(req, res){
        try{
            const users = await User.all();
            return res.render("admin/session/user-list.njk", {users})
        }
        catch(err){
            console.err(err)
        }
    }
};
