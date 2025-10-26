# CheeRain - Railwayデプロイ手順書

## 📋 概要

このドキュメントでは、CheeRainバックエンドとデータベースをRailwayにデプロイする手順を説明します。

---

## 🎯 デプロイ構成

- **バックエンド**: Spring Boot (Java 17) - Railway
- **データベース**: MySQL 8.0 - Railway
- **フロントエンド**: Next.js - Vercel

---

## 🚀 Railwayデプロイ手順

### 前提条件

1. [Railway](https://railway.app/)アカウント
2. GitHubリポジトリへのアクセス権
3. クレジットカード（無料枠あり、$5/月から）

---

## ステップ1: Railwayプロジェクトの作成

### 1-1. 新規プロジェクト作成

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「New Project」をクリック
3. 「Deploy from GitHub repo」を選択
4. `hera-16/cheerain`リポジトリを選択

### 1-2. サービスの設定

Railwayでは以下の2つのサービスを作成します：
- **MySQL Database**: データベースサービス
- **Backend API**: Spring Bootアプリケーション

---

## ステップ2: MySQLデータベースのセットアップ

### 2-1. MySQLサービスの追加

1. プロジェクト内で「+ New」をクリック
2. 「Database」→「Add MySQL」を選択
3. MySQLサービスが自動的にプロビジョニングされます

### 2-2. データベース接続情報の確認

MySQLサービスをクリックして、「Variables」タブで以下の変数を確認：

- `MYSQLHOST`: データベースホスト
- `MYSQLPORT`: ポート番号（デフォルト: 3306）
- `MYSQLDATABASE`: データベース名
- `MYSQLUSER`: ユーザー名
- `MYSQLPASSWORD`: パスワード
- `DATABASE_URL`: 完全な接続URL

これらの値は後でバックエンドサービスで使用します。

---

## ステップ3: バックエンドAPIのデプロイ

### 3-1. サービスの設定

1. プロジェクトに戻り、「+ New」→「GitHub Repo」をクリック
2. `hera-16/cheerain`リポジトリを選択
3. 「Add variables」をクリック

### 3-2. Root Directoryの設定

1. 「Settings」タブを開く
2. 「Service」セクションで以下を設定：
   - **Root Directory**: `backend`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/cheerain-backend-1.0.0.jar`

### 3-3. 環境変数の設定

「Variables」タブで以下の環境変数を追加：

#### データベース接続（MySQLサービスから取得）
```bash
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
```

#### JWT設定
```bash
JWT_SECRET=cheerain-production-jwt-secret-key-change-this-to-a-strong-random-value-2025
JWT_EXPIRATION=86400000
```

#### サーバー設定
```bash
SERVER_PORT=$PORT
SPRING_PROFILES_ACTIVE=prod
```

#### CORS設定
```bash
ALLOWED_ORIGINS=https://cheerain.vercel.app,https://your-custom-domain.com
```

**注意**:
- `JWT_SECRET`は本番環境用に必ず強力なランダム値に変更してください
- `ALLOWED_ORIGINS`にはVercelのデプロイURLを設定します

### 3-4. データベースの初期化

バックエンドが起動したら、データベースに初期データを投入します：

1. Railwayの「Data」タブでMySQLサービスを開く
2. 「Connect」をクリックして接続情報を取得
3. ローカルまたはMySQLクライアントで接続し、以下のSQLを実行：

```bash
# 初期スキーマのセットアップ
cheerain/backend/setup_database.sql

# 選手データの投入
cheerain/backend/update_players.sql

# 試合データの投入
cheerain/backend/init-matches.sql
```

または、Railway CLIを使用：

```bash
# Railway CLIのインストール
npm i -g @railway/cli

# ログイン
railway login

# プロジェクトにリンク
railway link

# データベースに接続してSQLを実行
railway run psql < backend/setup_database.sql
```

---

## ステップ4: ヘルスチェックの設定

### 4-1. ヘルスチェックエンドポイント

Spring Boot Actuatorが有効になっているため、以下のエンドポイントでヘルスチェックが可能：

- **ヘルスチェック**: `https://your-backend.railway.app/actuator/health`

### 4-2. Railwayのヘルスチェック設定

1. 「Settings」タブを開く
2. 「Healthcheck」セクションで以下を設定：
   - **Path**: `/actuator/health`
   - **Timeout**: `300` (秒)

---

## ステップ5: カスタムドメインの設定（オプション）

### 5-1. ドメインの追加

1. バックエンドサービスの「Settings」タブを開く
2. 「Domains」セクションで「Generate Domain」をクリック
3. Railwayが自動的にドメインを生成（例: `cheerain-backend.up.railway.app`）
4. カスタムドメインを使用する場合は「Custom Domain」を追加

### 5-2. フロントエンドの環境変数を更新

生成されたドメインをフロントエンド（Vercel）の環境変数に設定：

```bash
NEXT_PUBLIC_API_BASE_URL=https://cheerain-backend.up.railway.app/api/v1
```

---

## 📊 デプロイ後の確認

### 1. バックエンドの動作確認

```bash
# ヘルスチェック
curl https://your-backend.railway.app/actuator/health

# ユーザーエンドポイント
curl https://your-backend.railway.app/api/v1/users

# 選手一覧
curl https://your-backend.railway.app/api/v1/players
```

### 2. データベース接続の確認

1. Railwayダッシュボードで「Observability」タブを確認
2. ログに「HikariPool」の接続ログが表示されることを確認
3. エラーがないことを確認

### 3. CORS設定の確認

フロントエンド（Vercel）からAPIにアクセスできることを確認：

```javascript
// ブラウザのコンソールで実行
fetch('https://your-backend.railway.app/api/v1/players')
  .then(res => res.json())
  .then(data => console.log(data))
```

---

## 🔧 トラブルシューティング

### ビルドエラー

**問題**: Maven buildが失敗する

**解決策**:
1. `pom.xml`の依存関係を確認
2. Java 17がインストールされているか確認
3. ビルドログを確認して具体的なエラーを特定

```bash
# ローカルでビルドテスト
cd backend
mvn clean package -DskipTests
```

### データベース接続エラー

**問題**: アプリケーションがデータベースに接続できない

**解決策**:
1. 環境変数が正しく設定されているか確認
2. MySQL serviceが起動しているか確認
3. ネットワーク設定を確認（Railwayではプライベートネットワークでサービスが接続されます）

### メモリ不足エラー

**問題**: アプリケーションがOOM（Out of Memory）でクラッシュ

**解決策**:
1. Railway Planを確認（無料プランは512MBまで）
2. JVMヒープサイズを調整：

```bash
# Start Commandを以下に変更
java -Xmx400m -Xms256m -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/cheerain-backend-1.0.0.jar
```

### CORS エラー

**問題**: フロントエンドからAPIアクセス時にCORSエラー

**解決策**:
1. `ALLOWED_ORIGINS`環境変数にVercelのURLが含まれているか確認
2. `WebConfig.java`のCORS設定を確認
3. プロトコル（http/https）が一致しているか確認

---

## 💰 コストの見積もり

### Railwayの料金プラン

- **Hobby Plan** (無料): $5クレジット/月
  - 512MB RAM, 1GB ディスク
  - 個人プロジェクト向け

- **Pro Plan** ($20/月): $20クレジット/月
  - 8GB RAM, 100GB ディスク
  - 本番環境推奨

### 推奨構成

**開発/テスト環境**:
- Hobby Plan
- MySQL: 最小構成

**本番環境**:
- Pro Plan
- MySQL: 中規模構成（2GB RAM, 10GB ディスク）
- 推定コスト: $20-30/月

---

## 🔐 セキュリティのベストプラクティス

### 1. 環境変数の管理

- 本番環境の環境変数は必ずRailwayダッシュボードで設定
- `.env`ファイルをGitにコミットしない（`.gitignore`に追加済み）
- `JWT_SECRET`は強力なランダム値を使用

### 2. データベースセキュリティ

- パスワードは自動生成されたものを使用
- 本番環境では`spring.jpa.show-sql=false`に設定
- 定期的にバックアップを取得

### 3. API セキュリティ

- CORS設定を必要最小限に制限
- レート制限の実装を検討
- HTTPSを必ず使用

---

## 🔄 継続的デプロイ

Railwayは、GitHubリポジトリと自動的に連携します：

- **masterブランチへのpush**: 自動的に本番環境にデプロイ
- **他のブランチ**: プレビュー環境を自動生成（Pro Planのみ）

### デプロイの流れ

```bash
# バックエンドの変更をコミット
cd backend
git add .
git commit -m "feat: 新しいAPIエンドポイントを追加"
git push origin master

# Railwayが自動的にデプロイを開始
# 完了後、本番環境が更新される
```

---

## 📞 サポートとリソース

- [Railway Documentation](https://docs.railway.app/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## ✅ デプロイチェックリスト

### 事前準備
- [ ] Railwayアカウント作成
- [ ] GitHubリポジトリとの連携
- [ ] 環境変数の準備

### データベース
- [ ] MySQLサービスの作成
- [ ] データベース接続情報の確認
- [ ] 初期データの投入

### バックエンド
- [ ] サービスの作成とRoot Directory設定
- [ ] 環境変数の設定
- [ ] ビルドとデプロイの成功確認
- [ ] ヘルスチェックの確認

### フロントエンド連携
- [ ] RailwayのバックエンドURL取得
- [ ] Vercelの環境変数に`NEXT_PUBLIC_API_BASE_URL`を設定
- [ ] CORS設定の確認

### 動作確認
- [ ] APIエンドポイントの疎通確認
- [ ] データベース接続の確認
- [ ] フロントエンドからのAPI呼び出し確認

---

**デプロイURL**:
- Backend: https://cheerain-backend.up.railway.app
- Database: (Internal)

**デプロイ日時**: YYYY-MM-DD HH:MM
**担当者**:
