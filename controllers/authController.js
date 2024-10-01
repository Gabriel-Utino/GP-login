// controllers/authController.js
const bcrypt = require('bcrypt');
const pool = require('../db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // ユーザーモデルを読み込み

// ログイン処理
exports.login = async (req, res) => {
  const { email_usuario, senha } = req.body;

  try {
    const user = await User.findByEmail(email_usuario);

    if (!user) {
      req.flash('error', 'ユーザーが見つかりません');
      return res.redirect('/login');
    }

    const match = await bcrypt.compare(senha, user.senha);

    if (!match) {
      req.flash('error', 'パスワードが間違っています');
      return res.redirect('/login');
    }

    req.session.user = {
      id_usuario: user.id_usuario,
      nome_usuario: user.nome_usuario,
      cpf_usuario: user.cpf_usuario,
      endereco_usuario: user.endereco_usuario,
      telefone_usuario: user.	telefone_usuario,
      email_usuario: user.email_usuario,
      nascimento_usuario: user.nascimento_usuario,
      id_perfil: user.id_perfil
    };

    console.log('ユーザーがログインしました:', req.session.user); // デバッグ用ログ

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('サーバーエラー');
  }
};

// ログアウト処理
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/dashboard');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};

// ユーザー登録処理
exports.register = async (req, res) => {
  const { nome_usuario, cpf_usuario, email_usuario, senha } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    await User.create({
      nome_usuario,
      cpf_usuario,
      email_usuario,
      senha: hashedPassword,
      id_perfil: 3
    });

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error', '登録中にエラーが発生しました');
    res.redirect('/register');
  }
};

// パスワードリセットフォームを表示
exports.getForgotPassword = (req, res) => {
  const error = req.flash('error') || '';
  const info = req.flash('info') || ''; // infoメッセージを追加
  res.render('forgot-password', { error, info }); // errorとinfoをビューに渡す
};

// パスワードリセットリクエストの処理
exports.postForgotPassword = (req, res, next) => {
  const { email_usuario } = req.body;

  // リセットトークンを生成
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/forgot-password');
    }
    const token = buffer.toString('hex');

    // ユーザーを検索してリセットトークンと有効期限を保存
    User.findByEmail(email_usuario)
      .then(user => {
        if (!user) {
          req.flash('error', 'そのメールアドレスのユーザーは見つかりません');
          return res.redirect('/forgot-password');
        }

        const expiration = Date.now() + 3600000; // 1時間
        return User.saveResetToken(user.id_usuario, token, expiration);
      })
      .then(() => {
        // リセットリンクをメールで送信
        const transporter = nodemailer.createTransport({
          service: 'Gmail', // 使っているメールプロバイダに応じて設定
          auth: {
            user: process.env.EMAIL_USER, // 環境変数から読み込む
            pass: process.env.EMAIL_PASS
          },
          debug: true // デバッグ情報を表示
        });

        const mailOptions = {
          to: email_usuario,
          from: process.env.EMAIL_USER,
          subject: 'パスワードリセット',
          html: `
            <p>パスワードリセットのリクエストがありました</p>
            <p>下記のリンクをクリックして新しいパスワードを設定してください。</p>
            <a href="http://localhost:5000/reset-password/${token}">パスワードリセットリンク</a>
          `
        };

        return transporter.sendMail(mailOptions);
      })
      .then(() => {
        req.flash('info', 'リセットリンクをメールで送信しました。');
        res.redirect('/login');
      })
      .catch(err => {
        console.log(err);
        req.flash('error', 'パスワードリセット中にエラーが発生しました');
        res.redirect('/forgot-password');
      });
  });
};

// パスワードリセットページを表示
exports.getResetPassword = (req, res, next) => {
  const token = req.params.token;
  User.findByResetToken(token)
    .then(user => {
      if (!user) {
        req.flash('error', 'リセットトークンが無効か、有効期限が切れています。');
        return res.redirect('/forgot-password');
      }
      res.render('reset-password', { userId: user.id_usuario, token: token, message: req.flash('error') });
    })
    .catch(err => {
      console.log(err);
      req.flash('error', 'パスワードリセットページの取得中にエラーが発生しました');
      res.redirect('/forgot-password');
    });
};

// 新しいパスワードの保存
exports.postResetPassword = (req, res, next) => {
  const { userId, password, token } = req.body;

  User.findByResetToken(token)
    .then(user => {
      if (!user || user.id_usuario !== parseInt(userId, 10)) {
        req.flash('error', 'リセットトークンが無効か、有効期限が切れています。');
        return res.redirect('/forgot-password');
      }

      return bcrypt.hash(password, 12).then(hashedPassword => {
        return User.updatePassword(userId, hashedPassword);
      });
    })
    .then(() => {
      req.flash('info', 'パスワードがリセットされました。再度ログインしてください。');
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
      req.flash('error', 'パスワードリセット中にエラーが発生しました');
      res.redirect('/forgot-password');
    });
};
