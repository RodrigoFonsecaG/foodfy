const express = require('express');
const nunjucks = require('nunjucks');
const routes = require('./routes/index');
const methodOverride = require('method-override');

const session = require('./config/session');

const server = express();

server.use(session);

server.use((req,res,next) => {
  res.locals.session = req.session
  next();
})

server.use(express.urlencoded({ extended: true }));

server.use(express.static('public'));

server.use(methodOverride('_method'));

server.use(routes);

nunjucks.configure('src/app/views', {
  express: server,
  noCache: true
});

server.listen('5000');
