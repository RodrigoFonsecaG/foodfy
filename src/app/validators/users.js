const User = require('../models/User');
const { compare } = require('bcryptjs');

function checkAllFields(body) {
  // checando se todos os campos estão preenchidos
  const keys = Object.keys(body);

  for (let key of keys) {
    if (body[key] == '') {
      return {
        user: body,
        error: 'Por favor, preencha todos os campos!'
      };
    }
  }
}

async function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) {
    return res.render('admin/session/create.njk', fillAllFields);
  }

  // checando se o email já existe
  let { email } = req.body;

  const user = await User.findOne({
    where: { email }
  });

  if (user) {
    return res.render('admin/session/create.njk', {
      error: 'Email já cadastrado!'
    });
  }

  next();
}

async function put(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) {
    return res.render('admin/session/edit.njk', fillAllFields);
  }

  // has password
  const { id, password, email } = req.body;

  if (!password)
    return res.render('admin/session/edit.njk', {
      error: 'Coloque sua senha para atualizar seu cadastro.',
      user: req.body
    });

  // verificar se o novo email já existe
  let user = await User.findOne({ where: { email } });

  if (user && user.id != req.session.userId)
    return res.render('admin/session/edit.njk', {
      error: 'Email já cadastrado! Tente novamente!',
      user: req.body
    });

  // password match
  user = await User.findOne({ where: { id } });
  const passed = await compare(password, user.password);
  if (!passed)
    return res.render('admin/session/edit.njk', {
      error: 'Senha incorreta!',
      user: req.body
    });

  req.user = user;

  next();
}

async function login(req, res, next) {
  //verificar se o usuario está cadastrado
  const { email, password } = req.body;

  let user = await User.findOne({ where: { email } });

  if (!user)
    return res.render('admin/session/login.njk', {
      error: 'Usuário não encontrado, tente outro email!',
      user: req.body
    });

  //verificar se o password é valido.

  const passed = await compare(password, user.password);

  if (!passed)
    return res.render('admin/session/login.njk', {
      user: req.body,
      error: 'Senha incorreta, tente novamente!'
    });

  //colocar o usuario no req.session.
  req.user = user;

  next();
}

async function forgot(req, res, next) {
  const { email } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      return res.render('admin/session/forgot-password.njk', {
        user: req.body,
        error: 'Email não cadastrado, tente novamente!'
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error(err);
  }
}

async function reset(req, res, next) {
  const { email, password, passwordRepeat, token } = req.body;

  try {
    // procurar usuario
    let user = await User.findOne({ where: { email } });


    if (!user)
      return res.render('admin/session/reset-password.njk', {
        user: req.body,
        token,
        error: 'Email não cadastrado'
      });

    //ver se a senha bate
    if (password != passwordRepeat)
      return res.render('admin/session/reset-password.njk', {
        user: req.body,
        token,
        error: 'As senha não coincidem'
      });

    // verificar se o token bate
    if (user.reset_token != token)
      return res.render('admin/session/reset-password.njk', {
        user: req.body,
        token,
        error: 'Token inválido! Solicite uma nova recuperação de senha.'
      });

    // verifica se o token nao expirou
    let now = new Date();
    now = now.setHours(now.getHours());

    if (now > user.reset_token_expires)
      return res.render('admin/session/reset-password.njk', {
        user: req.body,
        token,
        error: 'Token expirado! Solicite uma nova recuperação de senha.'
      });

    req.user = user;

    next();
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  post,
  put,
  login,
  forgot,
  reset
};
