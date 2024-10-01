// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 認証関連のルート
router.get('/login', (req, res) => res.render('login', { message: req.flash('error') }));
router.get('/register', (req, res) => res.render('register', { message: req.flash('error') }));
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

// パスワードリセット関連のルート
router.get('/forgot-password', authController.getForgotPassword);
router.post('/forgot-password', authController.postForgotPassword);
router.get('/reset-password/:token', authController.getResetPassword);
router.post('/reset-password/:token', authController.postResetPassword);

module.exports = router;
