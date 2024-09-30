const pool = require('../db');

exports.createEvent = async (req, res) => {
    const { title, date } = req.body;

    try {
        await pool.query('INSERT INTO events (title, date) VALUES (?, ?)', [title, date]);
        res.send('イベントが作成されました');
    } catch (err) {
        console.error(err);
        res.status(500).send('イベント作成中にエラーが発生しました');
    }
};
