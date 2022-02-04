const crypto = require('crypto');
const {hash} = require('bcryptjs');
const User = require('../models/User');
const mailer = require('../../lib/mailer')

module.exports = {
    loginForm(req, res) {
        return res.render('admin/session/login.njk')
    },
    logout(req, res){
        req.session.destroy();

        return res.redirect('/');
    },
    login(req, res) {
        req.session.userId = req.user.id;
        req.session.is_admin = req.user.is_admin;

        return res.redirect("/admin/users/")
    },
    forgotPasswordForm(req, res) {
        return res.render('admin/session/forgot-password.njk')
    },
    async forgotPassword(req, res) {
        try{
        const user = req.user;


        // um token para esse usuario 
        const token = crypto.randomBytes(20).toString('hex');

        //criar uma expiração para o token
        let now = new Date();
        now = now.setHours(now.getHours() + 1) // uma hora par a expirar

        //enviar um email com um link de recuperação usando o token
        await User.update(user.id, {
            reset_token: token,
            reset_token_expires: now
        })



        //avisar o usuario que enviamos o email
        await mailer.sendMail({
            to: user.email,
            from: 'no-reply@foodfy.com',
            subject: 'Recuperação de senha',
            html: `<h2>Perdeu sua senha</h2>
            <p>Clique no link abaixo para recuperar sua senha</p>
            <p>
            <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">RECUPERAR SENHA</a>
            </p>`
        })

        return  res.render("admin/session/forgot-password.njk", {
            sucess: "Verique seu email para resetar sua senha!"
        })
    }
    catch(err){
        console.error(err);
    }
    },
    resetPasswordForm(req, res) {
        return res.render("admin/session/reset-password.njk", {token: req.query.token})
    },
    async resetPassword(req, res) {
        const {password} = req.body

        try{    
            const user = req.user;

            //criar um novo hash de senha
            const passwordHash = await hash(password, 8)

            // atualizar o usuario
            await User.update(user.id, {
                password: passwordHash,
                reset_token: "",
                reset_token_expires: ""
            })

            // avisa o usuario que ele tem uma nova senha 
            return res.render('admin/session/login.njk', {
                sucess: 'Nova senha cadastrada!'
            })

        }catch(err){
            console.error(err);

            return res.render("admin/session/reset-password.njk", {
                error: "Erro inesperado!",
                user: req.body,
                token
            })
        }
    }
}