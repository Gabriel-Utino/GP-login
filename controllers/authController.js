const bcrypt = require('bcrypt')
const pool = require('../db')

const crypto = require('crypto')
const nodemailer = require('nodemailer')
const User = require('../models/User') // ユーザーモデルを読み込み


exports.login = async (req, res) => {
  const { email_usuario, senha } = req.body

  try {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE email_usuario = ?', [email_usuario])

    if (rows.length === 0) {
      req.flash('error', 'ユーザーが見つかりません')
      return res.redirect('/login')
    }

    const user = rows[0]
    const match = await bcrypt.compare(senha, user.senha)

    if (!match) {
      req.flash('error', 'パスワードが間違っています')
      return res.redirect('/login')
    }

    req.session.user = {
      id_usuario: user.id_usuario,
      nome_usuario: user.nome_usuario,
      email_usuario: user.email_usuario,
      id_perfil: user.id_perfil
    }

    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.status(500).send('サーバーエラー')
  }
}

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/dashboard')
    }
    res.clearCookie('connect.sid')
    res.redirect('/login')
  })
}

exports.register = async (req, res) => {
  const { nome_usuario, cpf_usuario, email_usuario, senha } = req.body

  try {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(senha, saltRounds)

    await pool.query(
      `INSERT INTO usuario (nome_usuario, cpf_usuario, email_usuario, senha, id_perfil) 
             VALUES (?, ?, ?, ?, ?)`,
      [nome_usuario, cpf_usuario, email_usuario, hashedPassword, 3]
    )

    res.redirect('/login')
  } catch (err) {
    console.error(err)
    req.flash('error', '登録中にエラーが発生しました')
    res.redirect('/register')
  }
}



// パスワードリセットフォームを表示
exports.getForgotPassword = (req, res) => {
  res.render('forgot-password') // forgot-password.ejsのフォームを表示
}

// パスワードリセットリクエストの処理
exports.postForgotPassword = (req, res, next) => {
  const { email } = req.body

  // リセットトークンを生成
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect('/forgot-password')
    }
    const token = buffer.toString('hex')

    // ユーザーを検索してリセットトークンと有効期限を保存
    User.findOne({ where: { email: email } })
      .then(user => {
        if (!user) {
          req.flash('error', 'そのメールアドレスのユーザーは見つかりません')
          return res.redirect('/forgot-password')
        }

        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000 // 1時間
        return user.save()
      })
      .then(result => {
        // リセットリンクをメールで送信
        const transporter = nodemailer.createTransport({
          service: 'Gmail', // 使っているメールプロバイダに応じて設定
          auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
          }
        })

        const mailOptions = {
          to: email,
          from: 'your-email@gmail.com',
          subject: 'パスワードリセット',
          html: `
                        <p>パスワードリセットのリクエストがありました</p>
                        <p>下記のリンクをクリックして新しいパスワードを設定してください。</p>
                        <a href="http://localhost:5000/reset-password/${token}">パスワードリセットリンク</a>
                    `
        }

        return transporter.sendMail(mailOptions)
      })
      .then(() => {
        res.redirect('/login')
      })
      .catch(err => console.log(err))
  })
}

// パスワードリセットページを表示
exports.getResetPassword = (req, res, next) => {
  const token = req.params.token
  User.findOne({ where: { resetToken: token, resetTokenExpiration: { [Op.gt]: Date.now() } } })
    .then(user => {
      if (!user) {
        req.flash('error', 'リセットトークンが無効か、有効期限が切れています。')
        return res.redirect('/forgot-password')
      }
      res.render('reset-password', { userId: user.id, token: token })
    })
    .catch(err => console.log(err))
}

// 新しいパスワードの保存
exports.postResetPassword = (req, res, next) => {
  const { userId, password, token } = req.body

  let resetUser

  User.findOne({
    where: {
      resetToken: token,
      resetTokenExpiration: { [Op.gt]: Date.now() },
      id: userId
    }
  })
    .then(user => {
      if (!user) {
        req.flash('error', 'リセットトークンが無効か、有効期限が切れています。')
        return res.redirect('/forgot-password')
      }

      resetUser = user
      return bcrypt.hash(password, 12)
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword
      resetUser.resetToken = null
      resetUser.resetTokenExpiration = null
      return resetUser.save()
    })
    .then(() => {
      res.redirect('/login')
    })
    .catch(err => console.log(err))
}
