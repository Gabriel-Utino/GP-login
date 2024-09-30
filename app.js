const express = require('express');
const session = require('express-session');
const path = require('path');

const flash = require('connect-flash');
const rateLimit = require('express-rate-limit');
const pool = require('./db');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const eventController = require('./controllers/eventController');
const isAuthenticated = require('./middleware/isAuthenticated');
const authorize = require('./middleware/authorize');
const passport = require('./config/passport');
const routes = require('./routes'); // ルートを読み込む
require('dotenv').config();

const app = express();

// ミドルウェア設定
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 } // 1時間
}));

// Passportの初期化
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.set('view engine', 'ejs');

// 静的ファイルの配信を設定
app.use(express.static(path.join(__dirname, 'public')));

// ルート設定
app.use('/', routes); // ルートを適用

app.get('/login', (req, res) => res.render('login', { message: req.flash('error') }));
app.get('/register', (req, res) => res.render('register', { message: req.flash('error') }));

app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
      return res.redirect('/login'); // 認証されていない場合はログインページにリダイレクト
  }
  res.render('dashboard', { user: req.session.user });
});


// ログイン試行の制限
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, message: '短時間に多くのログイン試行が行われました。しばらくしてから再度お試しください。' });
app.post('/login', loginLimiter, authController.login);
app.post('/register', authController.register);
app.get('/logout', authController.logout);

// イベント作成ルート
app.post('/events/create', isAuthenticated, authorize(['Criar Eventos']), eventController.createEvent);

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`サーバーがポート${PORT}で起動しました`));
