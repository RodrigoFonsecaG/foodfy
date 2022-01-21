const User = require('../models/User');

function checkAllFields(body){
  // checando se todos os campos estão preenchidos
  const keys = Object.keys(body);
    
  for(let key of keys){
      if(body[key] == ""){
          return {
              user:body,
              error: 'Por favor, preencha todos os campos!'
          }
      }
  }
}

async function post(req,res, next){
  
    const fillAllFields = checkAllFields(req.body);

    if(fillAllFields){
        return res.render("admin/session/create.njk", fillAllFields)
    }


    // checando se o email já existe
    let {email} = req.body;

    const user = await User.findOne({
        where: {email}
    })

    if(user){
        return res.render("admin/session/create.njk", {error: "Email já cadastrado!"})
    }

    next();
}

module.exports = {
    post
}