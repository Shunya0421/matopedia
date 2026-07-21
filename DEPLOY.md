# まといのば気功技術大百科：無料デプロイ手順書

この手順どおりに進めれば、**完全無料**でサイトを公開できます。
難しい操作はありません。すべてブラウザ上で、所要時間は30分程度です。

## 登場するもの（全部無料）

| サービス | 役割 | 作るもの |
|---|---|---|
| GitHub | コードの置き場 | アカウント |
| Neon | データベース（投稿データの保存先） | アカウント |
| Render | Webサーバー（サイト本体） | アカウント |
| UptimeRobot | スリープ防止（任意） | アカウント |

---

## 手順1　GitHub にコードを置く（5分）

1. https://github.com/join でアカウント作成（メアド＋パスワード）
2. 右上の「＋」→「New repository」
3. Repository name に `matopedia` と入力 → Public のまま →「Create repository」
4. 作成されたページに表示されている「…or push an existing repository from the command line」の欄のURL（`https://github.com/あなたの名前/matopedia.git`）をコピー
5. サイト制作者（または git が使える人）に、そのURLとコード一式を渡して push してもらう

   ```bash
   git remote add origin https://github.com/あなたの名前/matopedia.git
   git branch -M main
   git push -u origin main
   ```

## 手順2　Neon でデータベースを作る（5分）

1. https://neon.tech にアクセス →「Sign up」→ GitHub アカウントで登録すると早い
2. 「Create a project」→ プロジェクト名は `matopedia`、リージョンは `Singapore` 推奨 →「Create project」
3. 表示される接続文字列（`postgresql://...` で始まる長い文字列）を**コピーしてメモ帳に保存**
   - 「Connection string」と書かれた欄。`Pooled connection` を選択

## 手順3　Render でサイトを公開する（10分）

1. https://render.com にアクセス →「Get Started」→ GitHub アカウントで登録
2. ダッシュボードで「New」→「Web Service」
3. 「Build and deploy from a Git repository」→「Next」
4. GitHub との連携を許可し、`matopedia` リポジトリを選んで「Connect」
5. 設定を入力：
   - **Name**：`matopedia`（URLが `matopedia.onrender.com` になる）
   - **Region**：`Singapore`
   - **Instance Type**：`Free`
   - 他は自動で読み込まれる（render.yaml のおかげで Dockerfile で動く）
6. 「Environment Variables」の欄で、次の3つを追加：

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | 手順2でコピーした `postgresql://...` の文字列 |
   | `INVITE_CODE` | 編集者に配る合言葉（例：好きな英数字8文字） |
   | `ADMIN_TOKEN` | 管理画面のパスワード（例：長めの英数字。推測されないもの） |

7. 「Deploy Web Service」→ 5〜10分でビルドが完了し、URLが発行される

## 手順4　データベースの初期化（初回のみ・2分）

1. Neon のダッシュボードで `matopedia` プロジェクトを開く
2. 左メニュー「SQL Editor」→ 次のSQLを貼って「Run」：

```sql
CREATE TYPE editor_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE contribution_status AS ENUM ('pending', 'published', 'rejected');

CREATE TABLE editors (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  status editor_status NOT NULL DEFAULT 'pending',
  token VARCHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE contributions (
  id BIGSERIAL PRIMARY KEY,
  editor_id VARCHAR(64) NOT NULL,
  editor_name VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  reading VARCHAR(255),
  lead TEXT NOT NULL,
  body TEXT,
  sources TEXT,
  status contribution_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## 手順5　スリープ防止（任意・3分）

無料枠は15分アクセスがないと寝るので、防ぎたい場合：

1. https://uptimerobot.com でアカウント作成
2. 「Add New Monitor」→ Monitor Type: `HTTP(s)` → URL に `https://matopedia.onrender.com` → 間隔 5分 →「Create Monitor」

---

## 公開後の運用

- **サイトのURL**：`https://matopedia.onrender.com`（手順3の Name で変わる）
- **管理者**：`https://matopedia.onrender.com/admin` にアクセスし、手順3の `ADMIN_TOKEN` でログイン。投稿の承認・却下・削除、編集者の除名ができる
- **有志の編集者**：サイト内「編集に参加する」から、メアド・氏名と手順3の `INVITE_CODE` を入力して登録

## 困ったとき

- **画面が開かない**：無料枠のスリープかも。30秒待って再読み込み。手順5の設定で予防できる
- **投稿が保存されない**：Render の環境変数 `DATABASE_URL` が正しいか確認。Neon の SQL Editor でテーブルが作られているか確認
- **コードを更新したい**：GitHub に push すれば Render が自動で再デプロイする
