const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt'); // bcryptのインポート

// ユーザー認証のためのローカル戦略を設定
passport.use(new LocalStrategy((username, password, done) => {
    // データベースからユーザーを検索
    // User.findOne({ username: username }, (err, user) => {
    //     if (err) return done(err);
    //     if (!user) return done(null, false); // ユーザーが見つからない場合
    //     
    //     // パスワードが正しいか確認
    //     bcrypt.compare(password, user.password, (err, res) => {
    //         if (res) {
    //             return done(null, user); // 認証成功
    //         } else {
    //             return done(null, false); // パスワードが間違っている場合
    //         }
    //     });
    // });
}));

passport.serializeUser((user, done) => {
    done(null, user.id); // ユーザーIDをセッションに保存
});

passport.deserializeUser((id, done) => {
    // IDからユーザーを検索
    // User.findById(id, (err, user) => {
    //     done(err, user);
    // });
});

// Passportをエクスポート
module.exports = passport;
