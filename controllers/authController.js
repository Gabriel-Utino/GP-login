const bcrypt = require('bcrypt');
const pool = require('../db');

exports.login = async (req, res) => {
    const { email_usuario, senha } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM usuario WHERE email_usuario = ?', [email_usuario]);
        
        if (rows.length === 0) {
            req.flash('error', 'ユーザーが見つかりません');
            return res.redirect('/login');
        }

        const user = rows[0];
        const match = await bcrypt.compare(senha, user.senha);
        
        if (!match) {
            req.flash('error', 'パスワードが間違っています');
            return res.redirect('/login');
        }

        req.session.user = {
            id_usuario: user.id_usuario,
            nome_usuario: user.nome_usuario,
            email_usuario: user.email_usuario,
            id_perfil: user.id_perfil
        };

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('サーバーエラー');
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};

exports.register = async (req, res) => {
    const { nome_usuario, cpf_usuario, email_usuario, senha } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        await pool.query(
            `INSERT INTO usuario (nome_usuario, cpf_usuario, email_usuario, senha, id_perfil) 
             VALUES (?, ?, ?, ?, ?)`,
            [nome_usuario, cpf_usuario, email_usuario, hashedPassword, 3]
        );

        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error', '登録中にエラーが発生しました');
        res.redirect('/register');
    }
};
