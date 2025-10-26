# CheeRain（チアレイン）

**ファンの声を選手に届ける、新しい応援のカタチ**

ギラヴァンツ北九州の選手に応援メッセージを送ると、それがNFTカードとして永久保存される革新的な応援アプリです。

---

## 🎯 プロジェクト概要

CheeRainは、ファンが送った応援コメントをブロックチェーン上にNFTとして記録し、選手のモチベーション向上とファンエンゲージメント強化を実現するフルスタックWebアプリケーションです。

### 主な機能

#### ファン向け機能
- **応援メッセージNFT発行**: 選手への応援メッセージをNFTとして永久保存（データベース版）
- **ブロックチェーンNFT発行**: Polygon Amoy Testnetで実際にオンチェーンNFTを発行
- **ウォレット接続**: MetaMask/WalletConnectでWeb3ウォレット接続
- **NFTコレクション**: 自分が発行したNFTを一覧で確認
- **ポイントシステム**: NFT発行・会場来場でポイント獲得
- **人気投票機能**: 応援数に基づいて人気選手をランキング表示
- **QRコード発行**: NFTをQRコードで共有可能
- **会場来場特典**: 会場コード入力で追加ポイント獲得

#### 管理者向け機能
- **Admin管理画面**: ユーザー・NFT・分析データの一元管理
- **ユーザー管理**: 一覧表示・検索・role変更・詳細表示
- **NFT管理**: 発行済みNFTの一覧・削除・統計
- **試合管理**: 試合結果の自動取得・管理
- **会場コード管理**: 会場コードの発行・検証・無効化
- **分析機能**: 統計グラフ、人気選手ランキング、年間統計
- **選手データ管理**: 選手情報の自動取得・更新

#### 技術的特徴
- **フルスタック構成**: Next.js + Spring Boot + MySQL
- **REST API設計**: OpenAPI準拠のRESTful API
- **JWT認証**: セキュアな認証・認可システム
- **コンテンツモデレーション**: 不適切な投稿の自動検出
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **Docker対応**: コンテナ化による簡単なデプロイ

---

## 🛠️ 技術スタック

### フロントエンド
- **Next.js 15** (App Router)
- **TypeScript** - 型安全性
- **Tailwind CSS 4** - スタイリング
- **React 19** - UIライブラリ

### バックエンド
- **Java 17** - プログラミング言語
- **Spring Boot 3.4** - RESTful APIフレームワーク
- **Spring Security** - 認証・認可
- **JWT (JSON Web Token)** - トークンベース認証
- **JPA / Hibernate** - ORM
- **MySQL 8.0** - リレーショナルデータベース
- **Maven** - ビルドツール
- **Firebase Authentication** - UID管理（補助的）

### ブロックチェーン・Web3
- **Polygon Amoy Testnet** - NFT発行ネットワーク
- **Wagmi 2.x** - Web3 React Hooks
- **Viem** - Ethereum library
- **Reown AppKit (WalletConnect)** - ウォレット接続UI
- **OpenZeppelin Contracts** - ERC-721スマートコントラクト
- **Hardhat** - スマートコントラクト開発環境
- **Ethers.js** - Ethereumライブラリ

### インフラ・DevOps
- **Docker & Docker Compose** - コンテナ化
- **Vercel** - フロントエンドホスティング（推奨）
- **Railway / Render** - バックエンドホスティング（推奨）
- **phpMyAdmin** - データベース管理UI

### 開発ツール
- **ESLint** - コード品質チェック
- **Git & GitHub** - バージョン管理

---

## 📦 セットアップ

### 前提条件

#### フロントエンド
- **Node.js 18.x以上**
- **npm または yarn**

#### バックエンド
- **Java 17**
- **Maven** (mvnwラッパー含む)
- **MySQL 8.0** または **Docker Desktop**

#### オプション
- **MetaMask等のWeb3ウォレット** (ブロックチェーンNFT発行用)
- **Firebaseプロジェクト** (Firebase Authentication用)

---

### クイックスタート（推奨）

最も簡単にセットアップするには、Docker Composeを使用します。

#### Docker Composeでの起動

```bash
# リポジトリのクローン
git clone https://github.com/hera-16/cheerain.git
cd cheerain

# バックエンドをDockerで起動
cd backend
docker-compose up -d

# フロントエンドのセットアップ
cd ..
npm install
npm run dev
```

これで以下が起動します：
- **MySQL**: `localhost:3306`
- **phpMyAdmin**: `http://localhost:8081`
- **Spring Boot API**: `http://localhost:8080`
- **Next.js フロントエンド**: `http://localhost:3000`

---

### 詳細なセットアップ手順

#### 1. リポジトリのクローン

```bash
git clone https://github.com/hera-16/cheerain.git
cd cheerain
```

#### 2. バックエンドのセットアップ

##### 方法A: Dockerを使用（推奨）

```bash
cd backend
docker-compose up -d
```

MySQL・phpMyAdmin・Spring Bootが自動的に起動します。

##### 方法B: ローカルMySQLを使用

```bash
# MySQLでデータベース作成
mysql -u root -p
CREATE DATABASE cheerain CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# application.propertiesを編集（必要に応じて）
cd backend/src/main/resources
# application.propertiesでDB接続情報を設定

# Spring Bootアプリケーションを起動
cd ../../../..
./mvnw spring-boot:run
```

**Windows の場合:**
```bash
mvnw.cmd spring-boot:run
```

#### 3. フロントエンドのセットアップ

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
# .env.local ファイルを作成
cp .env.example .env.local
```

`.env.local` を編集：

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# WalletConnect (ブロックチェーンNFT発行用)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# NFT Contract (デプロイ後に設定)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...
```

```bash
# 開発サーバーの起動
npm run dev
```

#### 4. 初期データの投入（オプション）

```bash
# 選手データを自動取得
# Spring Bootが起動すると自動的にスクレイピングが実行されます

# または手動でSQLを実行
mysql -u root -p cheerain < backend/update_players.sql
```

#### 5. 動作確認

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8080
- phpMyAdmin: http://localhost:8081 (Docker使用時)

---

### Firebase初期設定

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成
2. **Authentication** を有効化:
   - メール/パスワード認証を有効にする
3. プロジェクト設定から各種キーを取得し、`.env.local` に設定

---

### Admin権限の設定

管理画面にアクセスするには、データベースでユーザーのroleを変更します：

```sql
-- MySQLにログイン
mysql -u root -p cheerain

-- Admin権限を付与
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

または phpMyAdmin (http://localhost:8081) から：
1. `users` テーブルを開く
2. 対象ユーザーの `role` を `ADMIN` に変更

管理画面: http://localhost:3000/admin

---

## ⛓️ ブロックチェーンNFT発行のセットアップ

実際にPolygon Amoy Testnet上でNFTを発行する場合は、以下の追加セットアップが必要です。

### 詳細なセットアップガイド

📖 **[BLOCKCHAIN_SETUP.md](docs/BLOCKCHAIN_SETUP.md)** を参照してください。

### クイックスタート

1. **MetaMaskのインストール**
   - [MetaMask](https://metamask.io/)をブラウザにインストール

2. **Polygon Amoy Testnetの追加**
   - ネットワーク名: `Polygon Amoy Testnet`
   - RPC URL: `https://rpc-amoy.polygon.technology`
   - チェーンID: `80002`

3. **テストMATICの取得（無料）**
   - [Polygon Faucet](https://faucet.polygon.technology/)からテストトークンを取得

4. **WalletConnect Project IDの取得**
   - [Reown Cloud](https://cloud.reown.com/)でプロジェクトを作成
   - Project IDを `.env.local` に追加:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

5. **スマートコントラクトのデプロイ**
   ```bash
   # Hardhatでコントラクトをコンパイル
   npx hardhat compile

   # Polygon Amoy Testnetにデプロイ
   npx hardhat run scripts/deploy.js --network polygonAmoy
   ```

6. **コントラクトアドレスを設定**
   ```env
   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...
   ```

7. **ブロックチェーンNFT発行ページにアクセス**
   - `http://localhost:3000/blockchain-mint`

---

## 🚀 スクリプト・コマンド

### フロントエンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番環境起動
npm start

# Lint実行
npm run lint

# 型チェック
npm run type-check
```

### バックエンド

```bash
# Spring Bootアプリケーション起動
cd backend
./mvnw spring-boot:run  # Mac/Linux
mvnw.cmd spring-boot:run  # Windows

# ビルド（JARファイル作成）
./mvnw clean package

# テスト実行
./mvnw test

# Docker Composeで起動
docker-compose up -d

# Docker Composeで停止
docker-compose down

# ログ確認
docker-compose logs -f
```

### データベース

```bash
# MySQLに接続
mysql -u root -p cheerain

# データベース作成
mysql -u root -p -e "CREATE DATABASE cheerain CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 選手データを手動投入
mysql -u root -p cheerain < backend/update_players.sql
```

### ブロックチェーン

```bash
# スマートコントラクトをコンパイル
npx hardhat compile

# ローカルネットワークで起動
npx hardhat node

# Polygon Amoyにデプロイ
npx hardhat run scripts/deploy.js --network polygonAmoy

# コントラクトの動作確認
npx hardhat console --network polygonAmoy
```

---

## 📁 プロジェクト構造

```
cheerain/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # トップページ
│   ├── layout.tsx                # ルートレイアウト
│   ├── login/                    # ログイン・サインアップページ
│   ├── mypage/                   # マイページ
│   ├── matches/                  # 試合一覧ページ
│   ├── blockchain-mint/          # ブロックチェーンNFT発行ページ
│   ├── api/                      # Next.js API Routes
│   │   └── blockchain/           # ブロックチェーン関連API
│   └── admin/                    # Admin管理画面
│       ├── page.tsx              # Adminダッシュボード
│       ├── users/                # ユーザー管理
│       ├── nfts/                 # NFT管理
│       ├── matches/              # 試合管理
│       ├── venue-codes/          # 会場コード管理
│       └── analytics/            # 分析画面
├── backend/                      # Spring Boot バックエンド
│   ├── src/main/java/com/cheerain/
│   │   ├── CheerainApplication.java
│   │   ├── config/               # 設定クラス
│   │   │   ├── SecurityConfig.java
│   │   │   └── WebConfig.java
│   │   ├── controller/           # RESTコントローラー
│   │   ├── dto/                  # データ転送オブジェクト
│   │   ├── entity/               # エンティティ（DB）
│   │   ├── repository/           # JPAリポジトリ
│   │   ├── security/             # セキュリティ設定
│   │   └── service/              # ビジネスロジック
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── application-prod.properties
│   ├── docker-compose.yml        # Docker構成
│   ├── Dockerfile
│   ├── pom.xml                   # Maven設定
│   └── README.md                 # バックエンド詳細
├── components/                   # Reactコンポーネント
│   ├── Header.tsx                # ヘッダー
│   ├── NFTMintForm.tsx           # NFT発行フォーム（DB）
│   ├── BlockchainNFTMintForm.tsx # ブロックチェーンNFT発行フォーム
│   ├── NFTGallery.tsx            # NFTギャラリー
│   └── WalletConnectButton.tsx   # ウォレット接続ボタン
├── contexts/                     # React Context
│   ├── AuthContext.tsx           # 認証コンテキスト
│   └── Web3Provider.tsx          # Web3プロバイダー
├── lib/                          # ユーティリティ
│   ├── api.ts                    # API通信
│   ├── contract.ts               # スマートコントラクト
│   ├── wagmi.ts                  # Wagmi設定
│   └── contentModeration.ts      # コンテンツモデレーション
├── contracts/                    # スマートコントラクト
│   └── CheeRainNFT.sol           # ERC-721 NFTコントラクト
├── docs/                         # ドキュメント
│   ├── API_SPECIFICATION.md      # API仕様書
│   ├── DATABASE_SCHEMA.md        # DB設計
│   └── MIGRATION_OVERVIEW.md     # 移行ガイド
├── hardhat.config.js             # Hardhat設定
├── package.json
├── .env.local                    # 環境変数（Git管理外）
├── .env.example                  # 環境変数テンプレート
└── README.md                     # このファイル
```

---

## 🔐 Admin権限の設定

Admin管理画面にアクセスするには、Firestoreで以下の手順を実行してください：

1. Firebase Consoleを開く
2. Firestore Databaseで該当ユーザーを探す
3. `users`コレクションの対象ユーザードキュメントを編集
4. `role`フィールドを`admin`に設定

詳細は [`scripts/setAdminRole.md`](scripts/setAdminRole.md) を参照してください。

---

## 🌐 デプロイ

本番環境へのデプロイには、フロントエンドとバックエンドを別々にデプロイする必要があります。

### フロントエンド（Next.js）のデプロイ

#### Vercel（推奨）

1. **Vercelアカウントを作成**
   - https://vercel.com からGitHubでログイン

2. **GitHubリポジトリをインポート**
   - "New Project" → リポジトリを選択

3. **環境変数を設定**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=...
   ```

4. **デプロイ**
   - "Deploy" ボタンをクリック

#### その他のオプション
- **Netlify**: `npm run build && npm start`
- **AWS Amplify**
- **Firebase Hosting**

---

### バックエンド（Spring Boot）のデプロイ

#### Railway（推奨・無料枠あり）

1. **Railwayアカウント作成**
   - https://railway.app からGitHubでログイン

2. **新しいプロジェクトを作成**
   - "New Project" → "Deploy from GitHub repo"

3. **MySQLデータベースを追加**
   - "New" → "Database" → "MySQL"

4. **環境変数を設定**
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://your-mysql-host:3306/cheerain
   SPRING_DATASOURCE_USERNAME=root
   SPRING_DATASOURCE_PASSWORD=your-password
   JWT_SECRET=your-secure-random-string-here
   ```

5. **ビルドコマンドを設定**
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -jar target/cheerain-backend-1.0.0.jar`

#### Render（無料枠あり）

1. **Renderアカウント作成**
   - https://render.com からGitHubでログイン

2. **Web Serviceを作成**
   - "New" → "Web Service" → リポジトリ選択

3. **設定**
   - Environment: Docker
   - Docker Context: `./backend`
   - Dockerfile Path: `./backend/Dockerfile`

4. **MySQLを追加**
   - "New" → "PostgreSQL" または外部MySQLサービスを使用

5. **環境変数を設定**（Railwayと同じ）

#### その他のオプション
- **Heroku**: Dockerfileでデプロイ可能（有料）
- **AWS EC2 + RDS**: フル制御が可能だが設定が複雑
- **Google Cloud Run**: コンテナベースのデプロイ

---

### データベース

#### PlanetScale（MySQL互換・無料枠あり）

1. https://planetscale.com でアカウント作成
2. 新しいデータベースを作成
3. 接続文字列を取得
4. バックエンドの環境変数に設定

#### その他のオプション
- Railway / Render の付属MySQL
- **AWS RDS**: 本番環境向け、高可用性
- **Google Cloud SQL**

---

### デプロイ後の確認事項

- [ ] フロントエンドがバックエンドAPIに接続できるか確認
- [ ] データベースマイグレーションが完了しているか確認
- [ ] 環境変数がすべて正しく設定されているか確認
- [ ] Firebase Authenticationが動作しているか確認
- [ ] Admin権限が正しく設定されているか確認
- [ ] CORS設定が本番URLを許可しているか確認

---

### 本番環境用の設定

#### バックエンド（application-prod.properties）

```properties
# 本番環境用の設定
spring.datasource.url=jdbc:mysql://prod-mysql-host:3306/cheerain
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# CORS設定を本番URLに更新
cors.allowed-origins=https://your-vercel-app.vercel.app
```

#### フロントエンド

本番環境では、`NEXT_PUBLIC_API_URL` を本番バックエンドのURLに設定してください。

---

### デプロイのベストプラクティス

1. **ステージング環境を用意**: 本番前にテスト
2. **環境変数の管理**: `.env.example` を最新に保つ
3. **データベースバックアップ**: 定期的なバックアップを設定
4. **モニタリング**: ログとエラーを監視
5. **CI/CD**: GitHub Actionsで自動デプロイを設定（推奨）

---

## 🔐 環境変数の詳細説明

### フロントエンド（.env.local）

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `NEXT_PUBLIC_API_URL` | バックエンドAPIのベースURL | ✅ |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase APIキー | ✅ |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase認証ドメイン | ✅ |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | FirebaseプロジェクトID | ✅ |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebaseストレージバケット | ✅ |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging送信者ID | ✅ |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | FirebaseアプリID | ✅ |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Project ID | オプション |
| `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` | NFTコントラクトアドレス | オプション |

### バックエンド（application.properties）

| 変数名 | 説明 | デフォルト値 |
|--------|------|-------------|
| `spring.datasource.url` | データベース接続URL | `jdbc:mysql://localhost:3306/cheerain` |
| `spring.datasource.username` | データベースユーザー名 | `root` |
| `spring.datasource.password` | データベースパスワード | （空） |
| `jwt.secret` | JWT署名用シークレット | （要設定） |
| `jwt.expiration` | JWTトークンの有効期限（ミリ秒） | `86400000` (24時間) |
| `cors.allowed-origins` | CORSで許可するオリジン | `http://localhost:3000` |

---

## 📊 主要機能の説明

### 1. NFT発行機能
- **データベース版NFT**: 選手への応援メッセージをMySQLに保存
- **ブロックチェーン版NFT**: Polygon Amoy Testnetで実際にオンチェーンNFTを発行
- デフォルト画像またはカスタム画像を選択
- コンテンツモデレーション機能で不適切な投稿を自動検出

### 2. マイページ
- 自分が発行したNFT一覧（データベース版・ブロックチェーン版両方）
- ユーザー統計（発行数、獲得ポイント、称号）
- 会場コード入力でポイント獲得
- QRコード表示機能

### 3. Admin管理画面
- **ユーザー管理**: 一覧・検索・role変更・詳細表示
- **NFT管理**: 発行済みNFTの一覧・削除・統計
- **試合管理**: 試合結果の自動取得・編集・削除
- **会場コード管理**: コード発行・検証・無効化
- **分析機能**: 統計グラフ、人気選手ランキング、年間統計

### 4. 認証機能
- Firebase Authentication + JWT認証のハイブリッド方式
- ユーザー登録時にrole自動付与
- ログイン状態の永続化（localStorage）
- セキュアなトークン管理

### 5. 試合・選手データ管理
- ギラヴァンツ北九州の公式サイトから自動スクレイピング
- 選手データ・試合結果を自動更新
- Adminダッシュボードから手動更新も可能

---

## 🐛 トラブルシューティング

### よくある問題と解決策

#### 1. バックエンドが起動しない

**問題**: Spring Bootアプリケーションが起動しない

**解決策**:
```bash
# Javaバージョンを確認
java -version  # Java 17が必要

# MySQLが起動しているか確認
# Windows (XAMPP使用時)
C:\xampp\mysql\bin\mysql.exe -u root -e "SHOW DATABASES;"

# データベースが存在するか確認
mysql -u root -p cheerain -e "SHOW TABLES;"

# ポート8080が使用中でないか確認
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # Mac/Linux
```

#### 2. フロントエンドがバックエンドに接続できない

**問題**: `CORS error` または `Network error`

**解決策**:
- `.env.local` の `NEXT_PUBLIC_API_URL` が正しいか確認
- バックエンドの `application.properties` で `cors.allowed-origins` にフロントエンドのURLが含まれているか確認
- バックエンドが実際に起動しているか確認: `curl http://localhost:8080/api/v1/players`

#### 3. Firebase Authenticationエラー

**問題**: `Firebase: Error (auth/invalid-api-key)`

**解決策**:
- Firebase Consoleでプロジェクト設定を確認
- `.env.local` の Firebase設定がすべて正しく設定されているか確認
- Firebase Authentication が有効化されているか確認

#### 4. データベース接続エラー

**問題**: `Communications link failure`

**解決策**:
```bash
# MySQLが起動しているか確認
# Windows (XAMPP)
# XAMPPコントロールパネルでMySQLをStart

# データベースが作成されているか確認
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS cheerain CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

#### 5. JWT認証エラー

**問題**: `401 Unauthorized`

**解決策**:
- `jwt.secret` が設定されているか確認（application.properties）
- JWTトークンが有効期限内か確認
- ログアウト→再ログインを試す

#### 6. Docker Composeが起動しない

**問題**: `docker-compose up -d` でエラー

**解決策**:
```bash
# Docker Desktopが起動しているか確認
docker --version

# 既存のコンテナを削除して再起動
docker-compose down
docker-compose up -d --build

# ログを確認
docker-compose logs -f
```

#### 7. npm installでエラー

**問題**: 依存関係のインストールエラー

**解決策**:
```bash
# node_modulesとpackage-lock.jsonを削除
rm -rf node_modules package-lock.json  # Mac/Linux
rmdir /s node_modules && del package-lock.json  # Windows

# クリーンインストール
npm install

# または
npm ci
```

---

## 📚 関連ドキュメント

- [バックエンドREADME](backend/README.md) - Spring Boot詳細セットアップ
- [API仕様書](docs/API_SPECIFICATION.md) - REST APIエンドポイント
- [データベース設計](docs/DATABASE_SCHEMA.md) - テーブル構造
- [移行ガイド](docs/MIGRATION_OVERVIEW.md) - Firebase→Spring Boot移行の詳細

---

## 🤝 開発チーム

このプロジェクトは2人チームで開発されました。

- **チーム名**: hera-16
- **ハッカソン**: ギラヴァンツ北九州ハッカソン

---

## 🏆 ハッカソンテーマ

**対象テーマ**: ①ファン創出サービス + ③活動の盛り上げサービス

### 解決する課題
1. **ファン創出**: Web3技術で若年層・遠方ファンを獲得
2. **エンゲージメント強化**: 応援を可視化し、選手とファンの距離を縮める
3. **継続的な応援**: NFTコレクションでファンの熱量を維持

### 期待される効果
- 新規ファン獲得（特に若年層）
- 応援の可視化による選手モチベーション向上
- 北九州観光との連携可能性（NFT特典）

---

## 📄 ライセンス

MIT License

---

## 📞 お問い合わせ

質問や提案がある場合は、GitHubのIssueまたはPull Requestでお知らせください。

---

Built with ❤️ for ギラヴァンツ北九州 by Team hera-16
