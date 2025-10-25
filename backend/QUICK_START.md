# CheeRain Backend クイックスタートガイド

このガイドでは、CheeRain Backendを最速で起動する方法を説明します。

## 🚀 最速セットアップ（Docker使用）

### 前提条件
- Docker Desktop がインストール済み
- Git がインストール済み

### 手順

1. **リポジトリをクローン**
```bash
git clone <repository-url>
cd cheerain/backend
```

2. **環境変数ファイルを作成**
```bash
cp .env.example .env
```

`.env`ファイルを編集して、最低限以下を設定：
```env
DB_PASSWORD=your_secure_password
JWT_SECRET=your-very-long-secret-key-minimum-32-characters
```

3. **Docker Composeで起動**
```bash
docker-compose up -d
```

4. **動作確認**
```bash
curl http://localhost:8080/actuator/health
```

`{"status":"UP"}`が返ってくれば成功です！

---

## 💻 ローカル開発セットアップ（Java + Maven使用）

### 前提条件
- Java 17以上
- Maven 3.6以上
- MySQL 8.0以上

### 手順

1. **MySQLデータベースを作成**
```bash
mysql -u root -p
```

```sql
CREATE DATABASE cheerain CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

2. **application.propertiesを編集**

[src/main/resources/application.properties](src/main/resources/application.properties) で、データベースのパスワードを設定：

```properties
spring.datasource.password=your_mysql_password
```

3. **アプリケーションをビルド・実行**
```bash
mvn clean install
mvn spring-boot:run
```

4. **動作確認**
```bash
curl http://localhost:8080/actuator/health
```

---

## 🧪 初期データのセットアップ

### 管理者ユーザーの作成

1. **ユーザー登録API**を使用してユーザーを作成：

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

2. **MySQLで権限を変更**（Admin権限付与）：

```bash
mysql -u root -p cheerain
```

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

3. **ログインしてトークンを取得**：

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

レスポンスから`token`をコピーして、以降のリクエストで使用します。

### 選手データの登録

```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:8080/api/v1/players \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "田中太郎",
    "number": 10,
    "position": "FW",
    "isActive": true
  }'
```

---

## 📊 主要なAPIエンドポイント

### 認証
- `POST /api/v1/auth/register` - ユーザー登録
- `POST /api/v1/auth/login` - ログイン

### NFT
- `POST /api/v1/nfts` - NFT発行（要認証）
- `GET /api/v1/nfts/public` - NFT一覧取得
- `GET /api/v1/nfts/my` - 自分のNFT一覧（要認証）

### 選手
- `GET /api/v1/players` - 選手一覧
- `GET /api/v1/players/active` - アクティブな選手一覧

### 分析（Admin専用）
- `GET /api/v1/analytics` - 統計情報取得
- `GET /api/v1/analytics/ranking` - 選手別応援ランキング

---

## 🔍 トラブルシューティング

### Docker Composeが起動しない

**症状**: `docker-compose up`でエラー

**解決策**:
1. Docker Desktopが起動しているか確認
2. ポート8080と3306が使用されていないか確認：
   ```bash
   # Windows
   netstat -ano | findstr :8080
   netstat -ano | findstr :3306

   # macOS/Linux
   lsof -i :8080
   lsof -i :3306
   ```
3. 既存のコンテナを削除：
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

### データベース接続エラー

**症状**: `Could not open JDBC Connection`

**解決策**:
1. MySQLが起動しているか確認
2. `.env`ファイルのパスワードが正しいか確認
3. データベース`cheerain`が作成されているか確認

### JWTトークンエラー

**症状**: `Invalid JWT signature`

**解決策**:
1. `.env`の`JWT_SECRET`が32文字以上あることを確認
2. ログインして新しいトークンを取得

---

## 📝 次のステップ

1. **フロントエンドと連携**: [../README.md](../README.md)を参照
2. **詳細なAPI仕様**: [README.md](README.md)の「API仕様」セクション
3. **本番デプロイ**: [README.md](README.md)の「本番デプロイ」セクション

---

## 💡 開発Tips

### ホットリロード

開発中は`spring-boot-devtools`が有効なので、コードを変更すると自動的に再起動されます。

### ログの確認

```bash
# Dockerコンテナのログ
docker-compose logs -f api

# ローカル実行の場合
# コンソールに出力されます
```

### データベースのリセット

```bash
# Docker Composeの場合
docker-compose down -v
docker-compose up -d

# ローカルの場合
mysql -u root -p -e "DROP DATABASE cheerain; CREATE DATABASE cheerain;"
mvn spring-boot:run
```

---

困ったときは[README.md](README.md)の詳細なドキュメントを参照してください！
