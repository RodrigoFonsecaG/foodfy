const User = require('../models/User');


module.exports = {
  create(req, res) {
    return res.render('admin/session/create.njk');
  },
  async post(req, res) {
    try {
      const userId = await User.post(req.body);

      req.session.userId = userId;

      const id = userId;

      const user = await User.findOne({ where: { id } });
      req.session.is_admin = user.is_admin;

      return res.redirect(`/admin/users/${userId}/edit`);
    } catch (err) {
      console.error(err);
      return res.render('admin/session/create.njk', {
        error: 'Erro inesperado ao cadastrar usuário, tente novamente!'
      });
    }
  },
  async list(req, res) {
    try {
      const users = await User.all();
      return res.render('admin/session/user-list.njk', { users });
    } catch (err) {
      console.err(err);
    }
  },
  async edit(req, res) {
    try {
      let id = req.params.id;

      let user = await User.findOne({ where: { id } });

      if (!req.session.is_admin) {
        const { userId: id } = req.session;
        user = await User.findOne({ where: { id } });
      }

      return res.render('admin/session/edit.njk', { user });
    } catch (err) {
      console.error(err);
    }
  },
  async put(req, res) {
    let { name, email } = req.body;
    const { user } = req;

    await User.update(user.id, { name, email });

    return res.redirect(`/admin/users/${user.id}/edit`);
  },
  async delete(req,res) {
    const id = req.params.id;

    try{
      await User.delete(id);

      // Deslogando se nao for admin
      if(!req.session.is_admin){
        req.session.destroy();
      }

      return res.render('admin/session/user-list.njk', {
        sucess: "Usuário deletado com sucesso!"
      })

    }catch(err){
      console.error(err)
    }

  }
};
