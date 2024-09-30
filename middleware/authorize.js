const pool = require('../db');

module.exports = (permissions) => {
    return async (req, res, next) => {
        const userId = req.session.user.id;

        // ユーザーの権限を取得
        const [rows] = await pool.query('SELECT p.nome_permissao FROM permisao p JOIN perfil_permissao pp ON p.id_permissao = pp.id_permissao WHERE pp.id_perfil = ?', [req.session.user.perfil]);

        const userPermissions = rows.map(row => row.nome_permissao);
        
        // 必要な権限があるか確認
        const hasPermission = permissions.every(perm => userPermissions.includes(perm));
        if (!hasPermission) {
            return res.status(403).send('アクセス権限がありません');
        }

        next();
    };
};
