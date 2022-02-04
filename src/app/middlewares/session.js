const User = require('../models/User');

module.exports = {
  async onlyAdmin(req, res, next) {
    try {
      if (!req.session.userId) {
        return res.redirect('/users/login');
      } else if (req.session) {
        const { userId: id } = req.session;

        const user = await User.findOne({ where: { id } });

        if (!user.is_admin) {
          return res.redirect(`/admin/users/${id}/edit`);
        }
      }

      next();
    } catch (err) {
      console.error(err);
    }
  },
  onlyUser(req, res, next) {
    if (!req.session.userId) {
      return res.redirect('/users/login');
    }
    next();
  },
  onlyNonUsers(req, res, next) {
    if(req.session.userId) {
      return res.redirect('/admin/users');
    }

    next();
  }
};
