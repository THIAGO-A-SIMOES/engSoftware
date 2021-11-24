const express = require('express');
const route  = express.Router();
const loginController = require('./src/controllers/loginController');
const indexController = require ('./src/controllers/indexController')
const meuMiddleware = require('./src/middlewares/middleware');



route.get('/login', loginController.paginaLogin);
route.post('/login', loginController.efetuaLogin);

route.get('/register', loginController.paginaRegistro);
route.post('/register', loginController.efetuaRegistro);


route.get('/', indexController.paginaPrincipal);

module.exports = route;