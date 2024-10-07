##プロジェクト概要
このプロジェクトは、Node.js、Express.js、EJSを使用したロールベースのアクセス制御（RBAC）ウェブアプリケーションです。Admin（管理者）、Professor（教授）、Aluno（生徒）、Responsavel（保護者）、**Secretaria（秘書）**といった異なるユーザーロールに基づいて、特定の権限とアクセス権を管理します。各ユーザーは自分の役割に応じた機能を利用でき、セキュアで組織的なアクセス制御を実現します。

##機能
ユーザー認証: Passport.jsとbcryptを使用したセキュアなログインおよび登録システム。
ロールベースのアクセス制御: Admin、Professor、Aluno、Responsavel、Secretariaの各ロールに基づくアクセス権限。
プロフィール管理: 全ユーザーが自分のプロフィールを閲覧可能。SecretariaとAdminのみがプロフィールを編集可能。
成績および欠席管理:
Aluno: 自身の成績および欠席記録の閲覧。
Professor: 担当クラスの生徒の成績入力および欠席確認・変更。
Responsavel: 子供の成績および欠席記録の閲覧。
ユーザー登録: Secretariaが新しいProfessorおよびAlunoを登録可能。Adminがユーザーロールを管理。
パスワードリセット: SendGridを使用したセキュアなパスワードリセット機能。
レートリミティング: express-rate-limitを使用したブルートフォース攻撃防止。
入力バリデーション: express-validatorによるデータ整合性とセキュリティの確保。
フラッシュメッセージ: connect-flashを使用したユーザーフィードバックの提供。

##技術スタック
バックエンド:
Node.js
Express.js
MySQL2
Passport.js
bcrypt
dotenv
express-session
express-rate-limit
express-validator
multer
connect-flash
フロントエンド:
EJS（Embedded JavaScript Templates）
CSS（カスタムスタイル）
その他:
nodemailer & @sendgrid/mail（メールサービス）
nodemon（開発ツール）

##インストール手順
必要条件
Node.js（v14以上）
npm（Node Package Manager）
MySQL データベース
#手順
リポジトリをクローン
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
依存関係のインストール
npm install
データベースのセットアップ
データベースとテーブルの作成
以下のSQLスクリプトを実行して必要なテーブルを作成します。
CREATE TABLE `perfil` (
  `id_perfil` int(11) NOT NULL PRIMARY KEY,
  `nome_perfil` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `perfil` (`id_perfil`, `nome_perfil`) VALUES
(1, 'Admin'),
(2, 'Professor'),
(3, 'Aluno'),
(4, 'Responsavel'),
(5, 'Secretaria');

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nome_usuario` varchar(255) NOT NULL,
  `cpf_usuario` varchar(11) NOT NULL UNIQUE,
  `endereco_usuario` varchar(255) DEFAULT NULL,
  `telefone_usuario` varchar(255) DEFAULT NULL,
  `email_usuario` varchar(128) NOT NULL UNIQUE,
  `nascimento_usuario` date DEFAULT NULL,
  `senha` varchar(255) NOT NULL,
  `id_perfil` int(11) NOT NULL,
  `reset_token` varchar(255),
  `reset_token_expiration` datetime,
  PRIMARY KEY (`id_usuario`),
  FOREIGN KEY (`id_perfil`) REFERENCES `perfil`(`id_perfil`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `responsavel_aluno` (
  `id_responsavel` INT NOT NULL,
  `id_aluno` INT NOT NULL,
  PRIMARY KEY (`id_responsavel`, `id_aluno`),
  FOREIGN KEY (`id_responsavel`) REFERENCES `usuario`(`id_usuario`),
  FOREIGN KEY (`id_aluno`) REFERENCES `usuario`(`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

初期管理者ユーザーの追加
INSERT INTO `usuario` (`nome_usuario`, `cpf_usuario`, `endereco_usuario`, `telefone_usuario`, `email_usuario`, `nascimento_usuario`, `senha`, `id_perfil`)
VALUES ('Admin User', '12345678901', '住所', '電話番号', 'admin@example.com', '1990-01-01', 'hashed_password_here', 1);

##プロジェクト構造
your-project/
├── controllers/
│   ├── authController.js
│   └── userController.js
├── middleware/
│   └── auth.js
├── models/
│   └── User.js
├── public/
│   ├── css/
│   │   └── styles.css
│   └── icons/
│   └── js/
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
├── views/
│   ├── about.ejs
│   ├── home.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   ├── register.ejs
│   ├── register-user.ejs
│   ├── reset-password.ejs
│   ├── forgot-password.ejs
│   ├── student-grades.ejs
│   ├── student-attendance.ejs
│   ├── teacher-grades.ejs
│   ├── teacher-attendance.ejs
│   └── admin-dashboard.ejs
├── .env
├── app.js
├── package.json
└── README.md

#依存関係
Dependencies:

@sendgrid/mail@8.1.3: SendGridを使用したメール送信。
bcrypt@5.1.1: パスワードのハッシュ化。
connect-flash@0.1.1: フラッシュメッセージの管理。
cors@2.8.5: クロスオリジンリソースシェアリング。
dotenv@16.4.5: 環境変数の管理。
ejs@3.1.10: テンプレートエンジン。
express@4.21.0: Webフレームワーク。
express-rate-limit@7.4.0: レートリミティング。
express-session@1.18.0: セッション管理。
express-validator@7.2.0: 入力バリデーション。
mysql2@3.11.3: MySQLクライアント。
nodemailer@6.9.15: メール送信。
passport@0.7.0: 認証ミドルウェア。
passport-local@1.0.0: Passportのローカル戦略。
multer@1.4.5-lts.1: ファイルアップロード処理。
DevDependencies:

nodemon@3.1.7: 開発時の自動再起動ツール。

#アクセス制御
ユーザーロールと権限
Admin（管理者） - id_perfil: 1

全ユーザーの管理。
ユーザーロールの変更。
管理者ダッシュボードへのアクセス。
ホームページとプロフィールページへのアクセス。
Professor（教授） - id_perfil: 2

担当クラスの生徒の成績入力および欠席確認・変更。
ホームページとプロフィールページへのアクセス。
Aluno（生徒） - id_perfil: 3

自身の成績および欠席記録の閲覧。
ホームページとプロフィールページへのアクセス。
Responsavel（保護者） - id_perfil: 4

子供の成績および欠席記録の閲覧。
ホームページとプロフィールページへのアクセス。
Secretaria（秘書） - id_perfil: 5

新しいProfessorおよびAlunoの登録。
ユーザープロフィールの編集。
ホームページとプロフィールページへのアクセス。

#セキュリティ考慮事項
パスワードのハッシュ化: すべてのパスワードはbcryptを使用してハッシュ化して保存します。
環境変数の管理: .envファイルを使用して、APIキーやデータベース認証情報などの機密情報を管理します。.envファイルは.gitignoreに追加し、バージョン管理に含めないようにします。
入力バリデーション: express-validatorを使用して、すべてのユーザー入力を検証・サニタイズし、SQLインジェクションやXSS攻撃を防止します。
セッション管理: express-sessionの設定を適切に行い、セッションの安全性を確保します。セッションシークレットは強力なものを使用し、必要に応じてセッションの有効期限を設定します。
レートリミティング: express-rate-limitを使用して、ブルートフォース攻撃やDDoS攻撃からアプリケーションを保護します。
アクセス制御: ロールベースのアクセス制御により、ユーザーが許可されたリソースのみアクセスできるようにします。

#使用例
ユーザー登録
Secretaria（id_perfil: 5）およびAdmin（id_perfil: 1）は新しいProfessorおよびAlunoを登録できます。
ログイン
全ユーザーは /login ルートからログインできます。
プロフィールの閲覧・編集
全ユーザーは自分のプロフィールを閲覧できます。
SecretariaおよびAdminのみがプロフィールを編集できます。
成績および欠席の管理
Aluno: /student-grades および /student-attendance にアクセスして自身の記録を閲覧。
Professor: /teacher-grades および /teacher-attendance にアクセスして生徒の記録を管理。
Responsavel: プロフィールまたは専用ルートから子供の記録を閲覧。
管理者ダッシュボード
Adminは /admin-dashboard にアクセスして全ユーザーを管理し、ロールを変更できます。
パスワードリセット
ユーザーは /forgot-password からパスワードリセットをリクエストし、メールで送信されたリンクからパスワードをリセットします。