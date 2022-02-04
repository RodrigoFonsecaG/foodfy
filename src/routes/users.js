const express = require('express');
const routes = express.Router();

const Validator = require('../app/validators/users');

//const SessionController = require('../app/controllers/SessionController');
const UserController = require('../app/controllers/UserController');
const SessionController = require('../app/controllers/SessionController');


const {onlyAdmin, onlyUser, onlyNonUsers} = require('../app/middlewares/session');


//login/logout

routes.get('/users/login', onlyNonUsers, SessionController.loginForm)

routes.post('/users/login', Validator.login, SessionController.login)
routes.post('/users/logout', SessionController.logout)


// reset password / forgot password
routes.get('/users/forgot-password', SessionController.forgotPasswordForm);
routes.get('/users/password-reset', SessionController.resetPasswordForm);

routes.post('/users/forgot-password', Validator.forgot, SessionController.forgotPassword);
routes.post('/users/password-reset', Validator.reset, SessionController.resetPassword);


// register
routes.get('/admin/users/create', onlyAdmin ,UserController.create);
routes.post('/admin/users', Validator.post , UserController.post);


// user list 
routes.get('/admin/users', onlyAdmin, UserController.list);

//edit user
routes.get("/admin/users/:id/edit", onlyUser, UserController.edit);
routes.put('/admin/users/:id', Validator.put , UserController.put);

// delete user
routes.delete('/admin/users/:id', onlyAdmin, UserController.delete);


module.exports = routes