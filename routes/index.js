const express = require('express');
const router = express.Router();

// ルートにGETリクエストが来た時の処理
router.get('/', (req, res) => {
    res.send('Welcome to the application!');
});

// その他のルートの設定もここに追加できます

module.exports = router;
