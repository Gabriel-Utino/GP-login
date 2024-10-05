// middleware/isAuthenticated.js

function isAuthenticated(req, res, next) {
  console.log('Session User:', req.session.user); // デバッグ用ログ
  if (req.isAuthenticated()) {
      return next("/home"); // 認証されている場合は次のミドルウェアに進む
  }
  res.redirect('/login'); // 認証されていない場合はログインページにリダイレクト
}

module.exports = isAuthenticated;
