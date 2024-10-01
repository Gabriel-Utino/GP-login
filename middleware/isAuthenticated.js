// middleware/isAuthenticated.js

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next("/dashboard"); // 認証されている場合は次のミドルウェアに進む
  }
  res.redirect('/login'); // 認証されていない場合はログインページにリダイレクト
}

module.exports = isAuthenticated;
