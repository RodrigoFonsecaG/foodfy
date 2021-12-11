const express = require('express');
const nunjucks = require('nunjucks');
const routes = require('./routes.js');
const methodOverride = require('method-override');

const server = express();

server.use(express.urlencoded({ extended: true }));

server.use(express.static('public'));

server.use(methodOverride('_method'));

server.use(routes);

nunjucks.configure('src/app/views', {
  express: server,
  noCache: true
});

server.listen('5000');
