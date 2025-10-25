# CheeRain Backend API

Spring Boot製のバックエンドAPIサーバー

## 技術スタック

- **Java**: 17
- **Spring Boot**: 3.2.0
- **Spring Security**: JWT認証
- **Spring Data JPA**: データベースアクセス
- **MySQL**: データベース
- **Maven**: ビルドツール

## プロジェクト構造

```
backend/
├── src/
│   └── main/
│       ├── java/com/cheerain/
│       │   ├── CheerainApplication.java      # メインアプリケーション
│       │   ├── config/                        # 設定クラス
│       │   │   ├── SecurityConfig.java        # Spring Security設定
│       │   │   └── WebConfig.java             # CORS設定
│       │   ├── controller/                    # REST APIコントローラー
│       │   │   ├── AuthController.java        # 認証API
│       │   │   ├── UserController.java        # ユーザー管理API
│       │   │   ├── NftController.java         # NFT管理API
│       │   │   └── PlayerController.java      # 選手管理API
│       │   ├── service/                       # ビジネスロジック
│       │   │   ├── AuthService.java
│       │   │   ├── UserService.java
│       │   │   ├── NftService.java
│       │   │   └── PlayerService.java
│       │   ├── repository/                    # データアクセス層
│       │   │   ├── UserRepository.java
│       │   │   ├── NftRepository.java
│       │   │   └── PlayerRepository.java
│       │   ├── entity/                        # エンティティ（DBモデル）
│       │   │   ├── User.java
│       │   │   ├── Nft.java
│       │   │   └── Player.java
│       │   ├── dto/                           # データ転送オブジェクト
│       │   │   ├── request/                   # リクエストDTO
│       │   │   │   ├── LoginRequest.java
│       │   │   │   ├── RegisterRequest.java
│       │   │   │   └── NftCreateRequest.java
│       │   │   └── response/                  # レスポンスDTO
│       │   │       ├── ApiResponse.java
│       │   │       ├── LoginResponse.java
│       │   │       ├── UserResponse.java
│       │   │       ├── NftResponse.java
│       │   │       └── PlayerResponse.java
│       │   ├── security/                      # セキュリティ関連
│       │   │   ├── JwtTokenProvider.java      # JWT生成・検証
│       │   │   ├── JwtAuthenticationFilter.java # JWTフィルター
│       │   │   ├── UserDetailsImpl.java       # UserDetails実装
│       │   │   └── UserDetailsServiceImpl.java
│       │   └── exception/                     # 例外処理
│       │       ├── ResourceNotFoundException.java
│       │       ├── BadRequestException.java
│       │       └── GlobalExceptionHandler.java
│       └── resources/
│           └── application.properties          # アプリケーション設定
├── pom.xml                                     # Maven設定
└── setup_database.sql                          # データベース初期化スクリプト

```

## セットアップ手順

### 1. 前提条件

- Java 17以上
- Maven 3.6以上
- MySQL 8.0以上

### 2. MySQLデータベースのセットアップ

MySQLにログインして、データベースを作成します：

```bash
mysql -u root -p
```

```sql
CREATE DATABASE cheerain CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

または、付属のSQLスクリプトを使用：

```bash
mysql -u root -p < setup_database.sql
```

### 3. アプリケーション設定

[application.properties](src/main/resources/application.properties) を編集：

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/cheerain?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password_here

# JWT Configuration
jwt.secret=your-secret-key-here-change-this-in-production
jwt.expiration=86400000
```

**重要**: 本番環境では必ず`jwt.secret`を変更してください。

### 4. ビルドと実行

```bash
# ビルド
mvn clean install

# 実行
mvn spring-boot:run
```

サーバーは `http://localhost:8080` で起動します。

## API仕様

### 認証API

#### POST `/api/v1/auth/register`
ユーザー登録

**リクエストボディ**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "user_123456",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00"
  },
  "message": "ユーザー登録が完了しました"
}
```

#### POST `/api/v1/auth/login`
ログイン

**リクエストボディ**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "userId": "user_123456",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "2025-01-01T00:00:00"
    }
  },
  "message": "ログインに成功しました"
}
```

### NFT API

#### POST `/api/v1/nfts`
NFT発行（要認証）

**ヘッダー**:
```
Authorization: Bearer <JWT_TOKEN>
```

**リクエストボディ**:
```json
{
  "title": "頑張れ！",
  "message": "次の試合も応援してます！",
  "playerName": "田中太郎",
  "imageUrl": "https://example.com/image.png",
  "paymentAmount": 500,
  "paymentMethod": "CREDIT",
  "venueId": "12345"
}
```

#### GET `/api/v1/nfts/public`
NFT一覧取得（認証不要）

**クエリパラメータ**:
- `page`: ページ番号（デフォルト: 0）
- `size`: 1ページあたりの件数（デフォルト: 20）

#### GET `/api/v1/nfts/my`
自分のNFT一覧取得（要認証）

#### GET `/api/v1/nfts/public/player/{playerName}`
選手別NFT一覧取得

### 選手API

#### GET `/api/v1/players`
選手一覧取得

#### GET `/api/v1/players/active`
アクティブな選手一覧取得

#### GET `/api/v1/players/{id}`
選手詳細取得

### ユーザー管理API（Admin権限必要）

#### GET `/api/v1/users`
ユーザー一覧取得（Admin専用）

#### PATCH `/api/v1/users/{id}/role`
ユーザー権限変更（Admin専用）

### 分析API

#### GET `/api/v1/analytics`
統計情報取得（Admin専用）

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 100,
    "totalNfts": 500,
    "totalPlayers": 25,
    "activeUsers": 75,
    "topPlayers": [
      {
        "playerName": "田中太郎",
        "nftCount": 50,
        "rank": 1
      }
    ],
    "paymentMethodStats": [
      {
        "paymentMethod": "credit",
        "count": 300
      }
    ]
  }
}
```

#### GET `/api/v1/analytics/ranking`
選手別応援ランキング取得

**クエリパラメータ**:
- `limit`: 取得件数（デフォルト: 10）

## セキュリティ

- **JWT認証**: すべての保護されたエンドポイントはJWTトークンが必要
- **ロールベース認証**: USER / ADMINロールによるアクセス制御
- **パスワードハッシュ化**: BCryptによるパスワードの安全な保存
- **CORS設定**: フロントエンドからのアクセスを許可

## トラブルシューティング

### データベース接続エラー

```
Could not open JDBC Connection
```

**解決策**:
1. MySQLが起動しているか確認
2. `application.properties`のデータベース設定を確認
3. データベースユーザーの権限を確認

### JWTトークンエラー

```
Invalid JWT signature
```

**解決策**:
1. `application.properties`の`jwt.secret`が正しいか確認
2. トークンの有効期限が切れていないか確認

## 開発コマンド

```bash
# コンパイル
mvn compile

# テスト実行
mvn test

# パッケージング（JARファイル作成）
mvn package

# クリーンビルド
mvn clean install
```

## 本番デプロイ

### 方法1: JARファイルで直接実行

1. 環境変数を設定
2. JARファイルをビルド: `mvn clean package -Pprod`
3. 生成されたJARファイルを実行: `java -jar target/cheerain-backend-1.0.0.jar --spring.profiles.active=prod`

### 方法2: Dockerで実行（推奨）

#### 環境変数の設定

`.env`ファイルを作成（`.env.example`を参考）：

```bash
DB_PASSWORD=your_secure_password
JWT_SECRET=your-very-long-and-secure-secret-key-here
```

#### Docker Composeで起動

```bash
# ビルドと起動
docker-compose up -d

# ログ確認
docker-compose logs -f api

# 停止
docker-compose down

# データも削除して停止
docker-compose down -v
```

#### 個別にDockerイメージをビルド

```bash
# イメージビルド
docker build -t cheerain-backend:latest .

# コンテナ実行
docker run -p 8080:8080 \
  -e DB_HOST=host.docker.internal \
  -e DB_PASSWORD=password \
  -e JWT_SECRET=your-secret \
  cheerain-backend:latest
```

### ヘルスチェック

```bash
# ヘルスチェックエンドポイント
curl http://localhost:8080/actuator/health

# 期待されるレスポンス
{"status":"UP"}
```

## API仕様書の生成

Springdocを使用してOpenAPI（Swagger）仕様書を自動生成できます（オプション）。

## 環境変数一覧

| 変数名 | 説明 | デフォルト値 |
|--------|------|-------------|
| `DB_HOST` | データベースホスト | `localhost` |
| `DB_PORT` | データベースポート | `3306` |
| `DB_NAME` | データベース名 | `cheerain` |
| `DB_USERNAME` | データベースユーザー名 | `root` |
| `DB_PASSWORD` | データベースパスワード | `password` |
| `JWT_SECRET` | JWT署名用の秘密鍵 | （必須・本番では必ず変更） |
| `JWT_EXPIRATION` | JWTの有効期限（ミリ秒） | `86400000` (24時間) |
| `SERVER_PORT` | サーバーポート | `8080` |

## パフォーマンスチューニング

### JVMオプション

```bash
java -Xmx1g -Xms512m \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=200 \
  -jar target/cheerain-backend-1.0.0.jar
```

### データベース接続プール

`application.properties`に以下を追加：

```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
```

## 監視・ログ

### Actuatorエンドポイント

- ヘルスチェック: `/actuator/health`
- アプリケーション情報: `/actuator/info`

### ログレベル変更

```properties
# より詳細なログが必要な場合
logging.level.com.cheerain=TRACE
logging.level.org.springframework.security=DEBUG
```

## ライセンス

MIT License
