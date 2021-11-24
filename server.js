require('dotenv').config();//REFERENTE AS VARIÁVEIS DE AMBIENTE CONFIGURADAS NO ARQUIVO .env QUE NÃO DEVEM SER PUBLICADAS

const express = require('express');
const app = express();//INICIA O APP DO EXPRESS
const mongoose = require('mongoose');
mongoose.connect(process.env.connectionstring, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        app.emit('On');//CONEXAO COM O BANCO DE DADOS ATRAVÉS DE UM EVENTO
    })
    .catch(e => console.log(e)); //GRAVAÇÃO DO COOKIE

const session = require('express-session');
const MongoStore = require('connect-mongo');//GRAVAÇÃO DAS SESSÕES DENTRO DA BASE DE DADOS
const flash = require('connect-flash');//MENSAGENS AUTODESTRUTIVAS


const routes = require('./routes')//ROTAS DAS NOSSAS APLICAÇÕES
const path = require('path')//PARA TRABALHAR COM CAMINHOS ABSOLUTOS

const helmet = require('helmet');//HELMET SEGURANÇA
const csrf = require('csurf');//TOKENS DE SEGURANÇA PARA OS FORMULARIOS
const { checkCsrfError, csrfMiddleware, middlewareGlobal } = require('./src/middlewares/middleware');//ACESSO AOS MIDDLEWARES DA APLICAÇÃO

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'frontend')));//ARQUIVOS ESTÁTICOS(IMAGENS, CSS, JAVASCRIPT...)
app.use(helmet()); //USANDO O HELMET

const sessionOptions = session({
    secret: 'secret',
    store: MongoStore.create({ mongoUrl: process.env.connectionstring }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}); //CONFIGURAÇÃO DE SESSÕES

app.use(sessionOptions);
app.use(flash());


app.set('views', path.resolve(__dirname, 'src', 'views'));//ARQUIVOS QUE RENDERIZAMOS NA TELA COMO OS HTMLS
app.set('view engine', 'ejs');//ENGINE PARA RENDERIZAR O HTML


app.use(csrf());//USANDO O CSRF
app.use(checkCsrfError);//USANDO O MIDDLEWARE DE VERIFICAÇÃO DE ERRO
app.use(csrfMiddleware);//USANDO O MIDDLEWARE DE CSRF
app.use(middlewareGlobal);
app.use(routes);//CHAMANDO AS ROTAS

app.on('On', () => {
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000/login');
    });
});//MANDANDO NOSSA APLICAÇÃO ESCUTAR O EVENTO DE CONEXÃO COM O BANCO DE DADOS PARA DEPOIS LIGAR






