# CheeRain 完全デプロイガイド

## 📋 目次

1. [システム構成](#システム構成)
2. [デプロイの流れ](#デプロイの流れ)
3. [事前準備](#事前準備)
4. [ステップ1: バックエンド（Railway）](#ステップ1-バックエンドrailway)
5. [ステップ2: フロントエンド（Vercel）](#ステップ2-フロントエンドvercel)
6. [ステップ3: 統合テスト](#ステップ3-統合テスト)
7. [トラブルシューティング](#トラブルシューティング)

---

## システム構成

```
┌─────────────────────────────────────────────────────┐
│                      ユーザー                         │
└────────────────┬────────────────────────────────────┘
                 │
       ┌─────────┴──────────┐
       │                    │
       ▼                    ▼
┌─────────────┐      ┌─────────────┐
│  Vercel     │      │  Wallet     │
│ (Frontend)  │      │ (MetaMask)  │
│             │      │             │
│ Next.js     │      │ Polygon     │
│ React       │      │ Amoy        │
└──────┬──────┘      └──────┬──────┘
       │                    │
       │ API Call           │ NFT Mint
       │                    │
       ▼                    ▼
┌─────────────┐      ┌─────────────┐
│  Railway    │      │ Blockchain  │
│ (Backend)   │      │ Contract    │
│             │      │             │
│ Spring Boot │      │ CheeRainNFT │
└──────┬──────┘      └─────────────┘
       │
       │ DB Connection
       │
       ▼
┌─────────────┐      ┌─────────────┐
│  Railway    │      │  Firebase   │
│ (MySQL)     │      │ (Auth/Store)│
└─────────────┘      └─────────────┘
```

### 技術スタック

**フロントエンド（Vercel）**:
- Next.js 15.5.6
- React 19
- TypeScript
- Tailwind CSS
- Wagmi + Reown AppKit（Web3）

**バックエンド（Railway）**:
- Spring Boot 3.2.0
- Java 17
- MySQL 8.0
- Spring Security + JWT

**その他**:
- Firebase（認証、Firestore）
- Polygon Amoy（NFT）

---

## デプロイの流れ

### 推奨順序

1. **Railway - MySQLデータベース** ✅
2. **Railway - バックエンドAPI** ✅
3. **Vercel - フロントエンド** ✅
4. **統合テスト** ✅

**重要**: バックエンドを先にデプロイし、そのURLをフロントエンドの環境変数に設定します。

---

## 事前準備

### 必要なアカウント

- [ ] GitHubアカウント
- [ ] Vercelアカウント（https://vercel.com/signup）
- [ ] Railwayアカウント（https://railway.app/）
- [ ] Firebaseプロジェクト
- [ ] Reown（WalletConnect）Project ID（https://cloud.reown.com/）

### 必要な情報の収集

#### 1. Firebase設定

Firebase Console（https://console.firebase.google.com/）から取得：

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

#### 2. WalletConnect Project ID

Reown Cloud（https://cloud.reown.com/）から取得：

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

#### 3. NFTコントラクトアドレス

デプロイ済みのNFTコントラクトアドレス：

```
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...
```

#### 4. JWT Secret

本番環境用のJWT Secretを生成：

```bash
# ランダムな64文字の文字列を生成
openssl rand -base64 64
```

---

## ステップ1: バックエンド（Railway）

### 1-1. Railwayプロジェクト作成

1. [Railway Dashboard](https://railway.app/dashboard)にアクセス
2. 「New Project」をクリック
3. 「Deploy from GitHub repo」を選択
4. `hera-16/cheerain`リポジトリを選択

### 1-2. MySQLデータベース追加

1. プロジェクト内で「+ New」→「Database」→「Add MySQL」
2. MySQLサービスが自動作成される
3. 「Variables」タブで接続情報を確認：
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

### 1-3. バックエンドサービス設定

#### Root Directoryの設定

「Settings」タブ:
- **Root Directory**: `backend`
- **Watch Paths**: `backend/**`

#### 環境変数の設定

「Variables」タブで以下を追加：

```bash
# データベース接続（MySQLサービスから参照）
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

# JWT設定（強力なランダム値を設定）
JWT_SECRET=your-super-secure-jwt-secret-key-here-min-256-bits
JWT_EXPIRATION=86400000

# サーバー設定
SERVER_PORT=$PORT
SPRING_PROFILES_ACTIVE=prod

# CORS設定（Vercelドメインを許可）
ALLOWED_ORIGINS=https://cheerain.vercel.app,https://*.vercel.app
```

**注意**: `${{MySQL.XXX}}`はRailwayの変数参照構文です。

#### ビルド設定

「Settings」→「Build」:
- Nixpacks を使用（自動検出）
- Build Command: `mvn clean package -DskipTests`
- Start Command: `java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/cheerain-backend-1.0.0.jar`

### 1-4. データベース初期化

#### 方法1: Railway MySQL Console

1. MySQLサービスの「Data」タブを開く
2. 「Query」で以下のSQLを実行：

```sql
-- backend/setup_database.sql の内容を実行
-- backend/update_players.sql の内容を実行
-- backend/init-matches.sql の内容を実行
```

#### 方法2: ローカルから接続

```bash
# Railway CLIインストール
npm i -g @railway/cli

# ログイン
railway login

# プロジェクトにリンク
railway link

# MySQLに接続
railway connect MySQL

# SQLファイルを実行
mysql> source backend/setup_database.sql;
mysql> source backend/update_players.sql;
mysql> source backend/init-matches.sql;
```

### 1-5. デプロイ確認

```bash
# ヘルスチェック
curl https://your-backend.railway.app/actuator/health

# レスポンス例
{"status":"UP"}
```

### 1-6. カスタムドメイン取得

「Settings」→「Domains」→「Generate Domain」

例: `cheerain-backend.up.railway.app`

**このURLをメモしておきます！** フロントエンドで使用します。

---

## ステップ2: フロントエンド（Vercel）

### 2-1. Vercelプロジェクト作成

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. 「Add New...」→「Project」
3. 「Import Git Repository」
4. `hera-16/cheerain`を選択

### 2-2. プロジェクト設定

#### Framework Preset
- **Framework**: Next.js（自動検出）

#### Root Directory
- **Root Directory**: `./` （プロジェクトルート）

#### Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 2-3. 環境変数設定

「Environment Variables」で以下を設定：

#### Firebase設定
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### Web3設定
```
NEXT_PUBLIC_POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=your_nft_contract_address
```

#### Backend API（⭐️ 重要）
```
NEXT_PUBLIC_API_BASE_URL=https://cheerain-backend.up.railway.app/api/v1
```

**注意**: Railwayで取得したバックエンドURLを設定してください。

### 2-4. デプロイ実行

1. 「Deploy」をクリック
2. ビルドプロセス（2〜5分）
3. デプロイ完了後、URLが発行される

例: `https://cheerain.vercel.app`

### 2-5. Firebase設定更新

Firebase Console → Authentication → Settings → Authorized domains

Vercelドメインを追加：
- `cheerain.vercel.app`
- `*.vercel.app`（プレビューデプロイ用）

---

## ステップ3: 統合テスト

### 3-1. バックエンドAPI疎通確認

```bash
# ヘルスチェック
curl https://cheerain-backend.up.railway.app/actuator/health

# 選手一覧取得
curl https://cheerain-backend.up.railway.app/api/v1/players

# レスポンス例
[
  {
    "id": 1,
    "name": "選手名",
    "position": "FW",
    ...
  }
]
```

### 3-2. フロントエンド動作確認

ブラウザで https://cheerain.vercel.app にアクセス：

- [ ] トップページが表示される
- [ ] 選手一覧が表示される
- [ ] ログイン/サインアップができる
- [ ] ウォレット接続ができる（MetaMask）
- [ ] NFT発行ページが動作する

### 3-3. CORS確認

ブラウザのコンソールで：

```javascript
fetch('https://cheerain-backend.up.railway.app/api/v1/players')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('CORS Error:', err));
```

エラーが出る場合は、RailwayのCORS設定を確認。

### 3-4. データベース接続確認

Railwayのログで確認：

```
HikariPool-1 - Start completed.
Initialized JPA EntityManagerFactory
```

---

## トラブルシューティング

### 🔧 バックエンド関連

#### ビルドエラー

**問題**: Maven buildが失敗

**解決策**:
```bash
# ローカルでビルドテスト
cd cheerain/backend
mvn clean package -DskipTests
```

#### データベース接続エラー

**問題**: `Communications link failure`

**解決策**:
1. 環境変数が正しく設定されているか確認
2. MySQL serviceが起動中か確認
3. `DB_HOST`に内部ホスト名を使用

#### メモリ不足

**問題**: `OutOfMemoryError`

**解決策**: Start Commandを変更
```bash
java -Xmx400m -Xms256m -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/cheerain-backend-1.0.0.jar
```

### 🔧 フロントエンド関連

#### ビルドエラー

**問題**: Next.js buildが失敗

**解決策**:
```bash
# ローカルでビルドテスト
cd cheerain
npm install
npm run build
```

#### API接続エラー

**問題**: `Failed to fetch`

**解決策**:
1. `NEXT_PUBLIC_API_BASE_URL`が正しいか確認
2. バックエンドが起動しているか確認
3. CORSエラーの場合、Railwayの`ALLOWED_ORIGINS`を確認

#### 環境変数が反映されない

**問題**: 環境変数が`undefined`

**解決策**:
1. 変数名が`NEXT_PUBLIC_`で始まっているか確認
2. Vercelで「All Environments」を選択したか確認
3. 再デプロイを実行

### 🔧 CORS関連

**問題**: CORSエラーが発生

**解決策**:

1. Railway環境変数に正しいオリジンを設定：
```bash
ALLOWED_ORIGINS=https://cheerain.vercel.app,https://*.vercel.app
```

2. [WebConfig.java](backend/src/main/java/com/cheerain/config/WebConfig.java)を確認

3. 再デプロイ

---

## 📊 デプロイ後のチェックリスト

### Backend（Railway）
- [ ] MySQLサービス起動
- [ ] バックエンドサービス起動
- [ ] ヘルスチェック成功
- [ ] データベース初期化完了
- [ ] ドメイン取得完了
- [ ] 環境変数設定完了

### Frontend（Vercel）
- [ ] ビルド成功
- [ ] デプロイ成功
- [ ] 環境変数設定完了
- [ ] Firebase承認済みドメイン追加
- [ ] トップページ表示確認

### Integration
- [ ] API疎通確認
- [ ] CORS動作確認
- [ ] 認証機能動作確認
- [ ] NFT発行機能動作確認
- [ ] ウォレット接続確認

---

## 🔐 セキュリティチェックリスト

### 必須事項
- [ ] JWT_SECREは強力なランダム値を使用
- [ ] データベースパスワードは自動生成値を使用
- [ ] `.env`ファイルはGitにコミットしない
- [ ] 本番環境では`spring.jpa.show-sql=false`
- [ ] CORS設定は必要最小限のドメインのみ許可
- [ ] HTTPSを使用（VercelとRailwayは自動対応）

### 推奨事項
- [ ] レート制限の実装
- [ ] API認証の強化
- [ ] ログ監視の設定
- [ ] 定期的なバックアップ設定

---

## 🔄 継続的デプロイ

### 自動デプロイの仕組み

**Railway**:
- `master`ブランチへのpush → 自動デプロイ
- `backend/**`配下の変更のみ検知

**Vercel**:
- `master`ブランチへのpush → 本番環境へ自動デプロイ
- その他のブランチ → プレビュー環境生成

### デプロイフロー

```bash
# フロントエンドの変更
git add app/ components/
git commit -m "feat: 新機能追加"
git push origin master
# → Vercelが自動デプロイ

# バックエンドの変更
git add backend/
git commit -m "feat: 新しいAPIエンドポイント追加"
git push origin master
# → Railwayが自動デプロイ
```

---

## 📞 サポートとドキュメント

### 公式ドキュメント
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [Next.js Docs](https://nextjs.org/docs)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)

### プロジェクト固有ドキュメント
- [Vercel デプロイガイド](./DEPLOYMENT.md)
- [Railway デプロイガイド](./RAILWAY_DEPLOYMENT.md)
- [バックエンド README](./backend/README.md)
- [フロントエンド README](./README.md)

---

## 📝 デプロイ記録

### 本番環境

**フロントエンド（Vercel）**:
- URL: https://cheerain.vercel.app
- デプロイ日時: YYYY-MM-DD HH:MM
- 担当者:

**バックエンド（Railway）**:
- URL: https://cheerain-backend.up.railway.app
- デプロイ日時: YYYY-MM-DD HH:MM
- 担当者:

**データベース（Railway MySQL）**:
- ホスト: (内部ネットワーク)
- セットアップ日時: YYYY-MM-DD HH:MM
- 担当者:

---

## ✅ 完了！

デプロイが完了したら、以下のURLでアプリケーションにアクセスできます：

🎉 **https://cheerain.vercel.app**

ユーザーはこのURLから：
- 選手情報の閲覧
- NFTの発行
- マイページの管理
- ウォレット接続

などの機能を利用できます。
