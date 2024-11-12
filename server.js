// app.js
const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const dotenv = require('dotenv')
const passport = require('./config/passport') // Passportの設定を読み込み

const authRoutes = require('./routes/authRoutes')
// 他のルートもインポート

dotenv.config()

const app = express()

// ミドルウェア設定
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // 本番環境ではtrue
      httpOnly: true,
      maxAge: 1000 * 60 * 10 // 1時間
    }
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// スタティックファイルの配信設定
app.use(express.static(path.join(__dirname, 'public')))

// ルート設定
app.use('/', authRoutes)
// 他のルートもマウント

// ダッシュボードルート
const isAuthenticated = require('./middleware/isAuthenticated')

app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login') // ユーザーがログインしていない場合
  }
  res.render('dashboard', { user: req.session.user }) // ダッシュボードを表示
})

app.get('/home', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login') // ユーザーがログインしていない場合
  }
  res.render('home', { user: req.session.user }) // ダッシュボードを表示
})

app.get('/dadosCadastrais', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login') // ユーザーがログインしていない場合
    }
    res.render('dadosCadastrais', { user: req.session.user }) // ダッシュボードを表示
  })
  
app.get('/veriNotas', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login') // ユーザーがログインしていない場合
    }
    res.render('veriNotas', { user: req.session.user }) // ダッシュボードを表示
  })
  
app.get('/veriFaltas', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login') // ユーザーがログインしていない場合
    }
    res.render('veriFaltas', { user: req.session.user }) // ダッシュボードを表示
  })

// 404エラーハンドリング
app.use((req, res, next) => {
  res.status(404).render('404', { message: 'ページが見つかりません' })
})

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('サーバーエラーが発生しました')
})

// サーバー起動
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`)
})
