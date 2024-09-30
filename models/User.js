// models/User.js

const mysql = require('mysql2/promise');
const pool = require('../config/database'); // あなたのデータベース設定に応じて変更

// ユーザーのモデルを定義
const User = {};

// ユーザーを取得するメソッド（例）
User.findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM usuario WHERE email = ?', [email]);
  return rows[0];
};

// 必要な他のメソッドも追加

module.exports = User;
