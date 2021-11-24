const Usuario = require('../models/LoginModel');


exports.paginaRegistro = (req, res) => {
    res.render('cadUser');
};

exports.efetuaRegistro = async (req, res) => {
    try{
        const register = new Usuario(req.body);
        await register.newRegister();
    
        if (register.errors.length > 0) {
            req.session.save(function(){
                return res.redirect('/register');
            });
            req.flash('errors', register.errors);
            return;
        }
        req.session.save(function(){
            return res.redirect('/register');
        });
        req.flash('success', 'Usuário cadastrado com sucesso.');
        return;
        

    } catch(e) {
        console.log(e);
        return res.render('404');
    }
};



exports.paginaLogin = (req, res) => {
    res.render('login');
};


exports.efetuaLogin = async (req, res) => {
    try{
        const login = new Usuario(req.body);
        await login.login();
    
        if (login.errors.length > 0) {
            req.session.save(function(){
                return res.redirect('/login');
            });
            req.flash('errors', login.errors);
            return;
        }

        req.session.user = login.user;
        req.session.save(function(){
            return res.redirect('/');
        });

    } catch(e) {
        console.log(e);
        return res.render('404');
    }
};
