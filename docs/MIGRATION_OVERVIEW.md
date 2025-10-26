# Firebase → Java + MySQL フルスタック移行ガイド

## 概要

このドキュメントは、Cheerain（応援NFTアプリ）をFirebase + Next.jsから**Java Spring Boot + MySQL + Next.js**のフルスタック構成に移行するための総合ガイドです。

---

## 現在の構成

```
[フロントエンド]
Next.js 15 + TypeScript
↓ Firebase SDK
[バックエンド]
Firebase Authentication
Firebase Firestore
Firebase Storage
```

---

## 移行後の構成

```
[フロントエンド]
Next.js 15 + TypeScript
↓ REST API (fetch)
[バックエンド]
Java Spring Boot + MySQL
```

---

## 役割分担

### あなた（バックエンド開発者）
- Java Spring Bootでサーバー構築
- MySQLデータベース設計・構築
- REST APIエンドポイント実装
- JWT認証の実装
- セキュリティ設定

### 別の人（フロントエンド開発者）
- Next.jsの既存コードを保守
- Firebase SDK呼び出しをREST API呼び出しに変更
- UIコンポーネントの改善
- ユーザー体験の向上

---

## 提供ドキュメント

### 1. データベース設計書
**ファイル:** `docs/DATABASE_SCHEMA.md`

**内容:**
- MySQLテーブル定義（users, nfts, players, venues）
- インデックス設計
- 外部キー制約
- 初期データサンプル
- Firestoreからの移行マッピング

**使い方:**
1. MySQLサーバーを起動
2. スキーマ定義のSQLを実行してテーブル作成
3. Spring BootのJPAエンティティを作成

---

### 2. API仕様書
**ファイル:** `docs/API_SPECIFICATION.md`

**内容:**
- 全REST APIエンドポイントの詳細仕様
- 認証API（登録、ログイン、ログアウト）
- NFT管理API（発行、一覧、詳細）
- 選手管理API
- 管理者機能API
- リクエスト/レスポンス例
- エラーコード一覧

**使い方:**
1. Spring BootのRestControllerを作成
2. 各エンドポイントを実装
3. Postman等でAPIテスト

---

### 3. フロントエンド連携ガイド
**ファイル:** `docs/FRONTEND_API_INTEGRATION_GUIDE.md`

**内容:**
- APIクライアント（`lib/api.ts`）の実装例
- Firebase呼び出しからREST API呼び出しへの変更例
- 認証機能の移行手順
- NFT発行機能の移行手順
- 各コンポーネントのBefore/After比較
- トラブルシューティング

**使い方（フロントエンド開発者向け）:**
1. `lib/api.ts`を作成
2. 各ページ/コンポーネントを順次移行
3. バックエンドAPIと連携テスト

---

## 移行の流れ

### Phase 1: 準備（1日目）
**バックエンド:**
- [ ] MySQL環境構築
- [ ] Spring Bootプロジェクト作成
- [ ] データベーススキーマ作成

**フロントエンド:**
- [ ] ドキュメント確認
- [ ] `lib/api.ts`の作成
- [ ] 環境変数の設定

---

### Phase 2: 認証機能（2日目）
**バックエンド:**
- [ ] UserエンティティとRepositoryを作成
- [ ] JWT認証の実装
- [ ] 認証API（登録、ログイン、ログアウト）の実装
- [ ] APIテスト

**フロントエンド:**
- [ ] ログイン画面の移行
- [ ] ユーザー登録画面の移行
- [ ] AuthContextの移行
- [ ] 動作確認

---

### Phase 3: NFT機能（3-4日目）
**バックエンド:**
- [ ] NFTエンティティとRepositoryを作成
- [ ] NFT発行APIの実装
- [ ] NFT一覧取得APIの実装
- [ ] NFT詳細取得APIの実装
- [ ] ページネーション実装

**フロントエンド:**
- [ ] NFT発行フォームの移行
- [ ] NFT一覧表示の移行
- [ ] マイページのNFT表示移行
- [ ] ページネーション実装

---

### Phase 4: 選手管理機能（5日目）
**バックエンド:**
- [ ] PlayerエンティティとRepositoryを作成
- [ ] 選手一覧取得APIの実装
- [ ] 選手作成/更新API（管理者のみ）の実装

**フロントエンド:**
- [ ] 選手一覧取得の移行
- [ ] 管理画面の選手管理機能移行

---

### Phase 5: 管理者機能（6日目）
**バックエンド:**
- [ ] ユーザー一覧取得API（管理者）の実装
- [ ] ユーザー権限変更API（管理者）の実装
- [ ] 分析データ取得API（管理者）の実装

**フロントエンド:**
- [ ] 管理画面の全機能移行
- [ ] 分析ダッシュボードの移行

---

### Phase 6: 最終調整とテスト（7日目）
**バックエンド:**
- [ ] 全APIのエラーハンドリング強化
- [ ] セキュリティ設定（CORS、レート制限等）
- [ ] ログ設定
- [ ] 統合テスト

**フロントエンド:**
- [ ] 全機能の動作確認
- [ ] エラーハンドリング改善
- [ ] ローディング状態の改善
- [ ] UIの微調整

**両者:**
- [ ] E2Eテスト
- [ ] パフォーマンステスト
- [ ] セキュリティチェック

---

## バックエンド開発の始め方

### 1. プロジェクト作成
[Spring Initializr](https://start.spring.io/) で以下を選択:
- **Project:** Maven
- **Language:** Java
- **Spring Boot:** 3.2.x
- **Packaging:** Jar
- **Java:** 17

**Dependencies:**
- Spring Web
- Spring Data JPA
- MySQL Driver
- Spring Security
- Validation
- Lombok

### 2. application.properties設定
```properties
# データベース設定
spring.datasource.url=jdbc:mysql://localhost:3306/cheerain?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT設定
jwt.secret=your-secret-key-here
jwt.expiration=86400000

# サーバー設定
server.port=8080
```

### 3. プロジェクト構成例
```
src/main/java/com/cheerain/
├── entity/           # JPAエンティティ
│   ├── User.java
│   ├── Nft.java
│   ├── Player.java
│   └── Venue.java
├── repository/       # Spring Data JPAリポジトリ
│   ├── UserRepository.java
│   ├── NftRepository.java
│   ├── PlayerRepository.java
│   └── VenueRepository.java
├── service/          # ビジネスロジック
│   ├── AuthService.java
│   ├── NftService.java
│   ├── PlayerService.java
│   └── AdminService.java
├── controller/       # REST Controller
│   ├── AuthController.java
│   ├── NftController.java
│   ├── PlayerController.java
│   └── AdminController.java
├── dto/              # Data Transfer Object
│   ├── request/
│   └── response/
├── config/           # 設定クラス
│   ├── SecurityConfig.java
│   ├── JwtTokenProvider.java
│   └── WebConfig.java
└── exception/        # 例外ハンドリング
    ├── CustomException.java
    └── GlobalExceptionHandler.java
```

---

## フロントエンド開発の始め方

### 1. API Base URLの設定
`.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

### 2. APIクライアントの作成
`lib/api.ts`を作成（詳細は`FRONTEND_API_INTEGRATION_GUIDE.md`参照）

### 3. 移行優先順位
1. 認証機能（ログイン/登録）
2. AuthContext
3. NFT発行フォーム
4. NFT一覧表示
5. マイページ
6. 管理画面

---

## Firebaseから移行する際の注意点

### 1. 認証方式の変更
- **Firebase:** Firebase Authenticationの`onAuthStateChanged`
- **新:** JWT トークンベースの認証

### 2. データ型の違い
- **Timestamp:** Firestoreの`Timestamp` → ISO 8601文字列
- **自動ID:** Firestoreの自動ID → UUID v4

### 3. リアルタイム更新
- Firestoreのリアルタイムリスナーは使用不可
- 必要に応じてポーリングまたはWebSocketを検討

### 4. 画像保存
- **オプション1:** Firebase Storageを引き続き使用
- **オプション2:** AmazonS3 / Cloudinary等に移行
- **オプション3:** バックエンドのローカルストレージ（本番非推奨）

---

## セキュリティチェックリスト

### バックエンド
- [ ] BCryptでパスワードハッシュ化
- [ ] JWTトークンの有効期限設定
- [ ] CORS設定を本番環境に合わせる
- [ ] レート制限の実装
- [ ] SQLインジェクション対策（PreparedStatement）
- [ ] XSS対策（入力バリデーション）
- [ ] HTTPS通信（本番環境）

### フロントエンド
- [ ] 環境変数でAPIキー管理
- [ ] XSS対策（React標準のエスケープ処理）
- [ ] CSRF対策（必要に応じてトークン使用）
- [ ] localStorageのトークン管理（XSS注意）

---

## トラブルシューティング

### 問題1: CORS エラー
**解決策:** Spring BootのWebConfigでCORS設定を追加
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("*")
                .allowedHeaders("*");
    }
}
```

### 問題2: JWTトークンが無効
**解決策:**
- トークンの有効期限を確認
- シークレットキーが正しいか確認
- ブラウザのlocalStorageを確認

### 問題3: データベース接続エラー
**解決策:**
- MySQLサーバーが起動しているか確認
- データベース名、ユーザー名、パスワードを確認
- `application.properties`の設定を確認

---

## 参考リソース

### Spring Boot
- [Spring Boot公式ドキュメント](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Spring Security](https://spring.io/projects/spring-security)

### MySQL
- [MySQL公式ドキュメント](https://dev.mysql.com/doc/)

### Next.js
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Fetch API](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API)

---

## サポート

質問や問題があれば、以下のドキュメントを参照してください:
1. `DATABASE_SCHEMA.md` - データベース設計
2. `API_SPECIFICATION.md` - API仕様
3. `FRONTEND_API_INTEGRATION_GUIDE.md` - フロントエンド連携

---

## まとめ

このガイドに従って移行を進めることで、Firebase依存から脱却し、Java + MySQLのフルスタックアプリケーションへと移行できます。

**バックエンド開発者:** API仕様書とデータベース設計書に基づいてサーバーを実装
**フロントエンド開発者:** 連携ガイドに従ってFirebase呼び出しをAPI呼び出しに変更

両者が協力してテストを行い、スムーズな移行を目指しましょう！
