const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isAuthenticated = require('../middleware/isAuthenticated');

// ユーザー関連のルート
router.get('/home', isAuthenticated, userController.getUserProfile);

module.exports = router;
