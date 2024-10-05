const pool = require('../db');

exports.getUserProfile = async (req, res) => {
    const userId = req.session.user.id;

    try {
        const [rows] = await pool.query('SELECT * FROM usuario WHERE id_usuario = ?', [userId]);
        
        if (rows.length > 0) {
            res.render('home', { user: rows[0] });
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro do servidor/サーバーエラー');
    }
};
