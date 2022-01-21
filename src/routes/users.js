const express = require('express');
const routes = express.Router();

const Validator = require('../app/validators/users');

//const SessionController = require('../app/controllers/SessionController');
const UserController = require('../app/controllers/UserController');
const { route } = require('express/lib/router');

//login/logout

//routes.get('/users/login', SessionController.loginForm)

//routes.post('/users/login', SessionController.login)
//routes.post('/users/logout', SessionController.logout)


// reset password / forgot password
//routes.get('/users/forgot-password', SessionController.forgotPasswordForm);
//routes.get('/users/password-reset', SessionController.resetPasswordForm);

//routes.post('/users/forgot-password', SessionController.forgotPassword);
//routes.post('/users/password-reset', SessionController.resetPassword);


// register
routes.get('/admin/users/create', UserController.create);
routes.post('/admin/users', Validator.post , UserController.post);


// user list 
routes.get('/admin/users', UserController.list)


module.exports = routes