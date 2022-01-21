const express = require('express');
const routes = express.Router();

const admin = require('./admin')
const visitors = require('./visitors')
const users = require('./users')


routes.use(admin)
routes.use(visitors)
routes.use(users)



module.exports = routes;