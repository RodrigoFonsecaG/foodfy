module.exports = {
    post(req,res,next){
        const keys = Object.values(req.body);

        for (let key of keys) {
          if (key == '') return res.render('admin/recipes/create.njk', {error: "Por favor, preencha todos os campos!"});
        }
  
        // Verificação se foi enviada imagem pelo usuario
        if (req.files.length == 0) {
          return res.render('admin/recipes/create.njk', {error: "Por favor, envie pelo menos uma imagem! "});
        }

        next();
    },
    put(req, res,next) {
        const keys = Object.keys(req.body);

        for (let key of keys) {
          if (req.body[key] == '' && key != 'removed_files') {
              return res.render("admin/recipes/edit.njk", {
                error:"Preecha todos os campos!"
              })
          }
        }

        console.log(req.body)

      next();
    }
}