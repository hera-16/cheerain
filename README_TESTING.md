# 🧪 CheeRain - テスト仕様書

## テストの目的

このプロジェクトでは、実務レベルの品質担保を目的として、以下の3層のテストを整備しています。

- **ユニットテスト**: ビジネスロジックの正確性を検証
- **統合テスト**: API層とコンポーネント層の結合を検証
- **E2Eテスト**: ユーザー視点での実際の操作フローを検証

**目標**: 新卒エンジニア採用のポートフォリオとして、「テストを設計・実装できる」能力を示すこと。100%のカバレッジを目指すのではなく、代表的な機能を適切にテストすることを優先しています。

---

## 📊 テスト構成

### 1. バックエンド（Spring Boot）

#### 使用技術
- **JUnit 5** - テストフレームワーク
- **Mockito** - モッキングライブラリ
- **Spring Boot Test** - Spring統合テスト
- **MockMvc** - REST APIテスト
- **H2 Database** - テスト用インメモリDB

#### テスト対象
- **ユニットテスト**: AuthService, NftService などのビジネスロジック
- **統合テスト**: AuthController, NftController などのREST API
- **リポジトリテスト**: JPA Repositoryの動作確認（必要に応じて）

#### ディレクトリ構成
```
backend/
├── src/
│   ├── main/java/com/cheerain/
│   └── test/java/com/cheerain/
│       ├── service/
│       │   ├── AuthServiceTest.java      # 認証サービスのテスト
│       │   └── NftServiceTest.java       # NFTサービスのテスト
│       └── controller/
│           └── AuthControllerTest.java   # 認証APIのテスト
└── src/test/resources/
    └── application.properties             # テスト用設定
```

#### テスト実行方法
```bash
# すべてのテストを実行
cd backend
./mvnw test

# 特定のテストクラスを実行
./mvnw test -Dtest=AuthServiceTest

# カバレッジレポート生成（オプション）
./mvnw test jacoco:report
```

---

### 2. フロントエンド（Next.js）

#### 使用技術
- **Jest** - テストフレームワーク
- **React Testing Library** - Reactコンポーネントテスト
- **@testing-library/jest-dom** - DOM検証マッチャー

#### テスト対象
- **コンポーネントテスト**: Header, NFTMintForm などのUIコンポーネント
- **ユーティリティテスト**: contentModeration.ts などのヘルパー関数
- **API Routeテスト**（オプション）: Next.js API Routes

#### ディレクトリ構成
```
cheerain/
├── __tests__/
│   ├── components/
│   │   └── Header.test.tsx               # ヘッダーコンポーネントのテスト
│   └── lib/
│       └── contentModeration.test.ts     # コンテンツモデレーションのテスト
├── jest.config.ts                        # Jest設定
└── jest.setup.ts                         # Jest初期化設定
```

#### テスト実行方法
```bash
# すべてのテストを実行
npm test

# ウォッチモードでテストを実行
npm run test:watch

# カバレッジレポート生成
npm run test:coverage
```

---

### 3. E2Eテスト（Playwright）

#### 使用技術
- **Playwright** - E2Eテストフレームワーク（TypeScriptネイティブサポート、高速、複数ブラウザ対応）

#### テスト対象
- **ユーザーフロー**: トップページ → ログイン → NFT発行
- **ナビゲーション**: ページ遷移の正常性
- **認証フロー**: ユーザー登録・ログイン機能

#### 選定理由: Playwright
- TypeScriptとの親和性が高い
- Next.jsとの相性が良い
- 複数ブラウザ（Chromium, Firefox, WebKit）を自動テスト可能
- 高速で安定したテスト実行

#### ディレクトリ構成
```
cheerain/
├── e2e/
│   ├── homepage.spec.ts                  # トップページのテスト
│   ├── auth.spec.ts                      # 認証フローのテスト
│   └── navigation.spec.ts                # ナビゲーションのテスト
└── playwright.config.ts                  # Playwright設定
```

#### テスト実行方法
```bash
# E2Eテストを実行（バックエンドとフロントエンドが起動している必要があります）
npm run test:e2e

# UIモードでテストを実行
npm run test:e2e:ui

# ヘッド付きモードでテストを実行（ブラウザを表示）
npm run test:e2e:headed

# 特定のテストファイルのみ実行
npx playwright test e2e/homepage.spec.ts
```

---

## 🚀 CI/CD設定（GitHub Actions）

### ワークフロー概要
`.github/workflows/cheerain-ci.yml` で自動テストを実行します。

#### トリガー
- `push`イベント: main, master, develop ブランチへのプッシュ時
- `pull_request`イベント: 上記ブランチへのPR作成時

#### ジョブ構成
1. **frontend-test**: フロントエンドのユニットテスト
   - Node.js 18.x / 20.x のマトリックステスト
   - ESLint実行
   - Jestテスト実行
   - カバレッジレポート生成

2. **backend-test**: バックエンドのユニットテスト
   - Java 17
   - Mavenビルド
   - JUnitテスト実行
   - テストレポート生成

3. **e2e-test**: E2Eテスト
   - Playwrightでブラウザ自動テスト
   - バックエンド起動
   - フロントエンド起動
   - E2Eテスト実行

4. **build-check**: ビルド確認
   - フロントエンド本番ビルド
   - バックエンドJARファイル生成

---

## 📖 テストの実行手順（開発者向け）

### 初回セットアップ

#### 1. バックエンドの依存関係インストール
```bash
cd backend
./mvnw clean install
```

#### 2. フロントエンドの依存関係インストール
```bash
npm install

# Playwrightブラウザのインストール
npx playwright install
```

### 日常的なテスト実行

#### ユニットテストのみ実行（高速）
```bash
# バックエンド
cd backend && ./mvnw test

# フロントエンド
npm test
```

#### E2Eテスト実行（バックエンド起動が必要）
```bash
# ターミナル1: バックエンドを起動
cd backend
./mvnw spring-boot:run

# ターミナル2: フロントエンドを起動
npm run dev

# ターミナル3: E2Eテストを実行
npm run test:e2e
```

#### すべてのテストを一括実行
```bash
# バックエンドテスト
cd backend && ./mvnw test && cd ..

# フロントエンドテスト
npm test

# E2Eテスト（バックエンド・フロントエンドが起動していることを確認）
npm run test:e2e
```

---

## 🎯 テスト設計の意図

### なぜこのテストを書いたか?

#### 1. **認証機能のテスト（AuthService, AuthController）**
- **意図**: 最も重要なセキュリティ関連機能のため、確実に動作することを保証
- **カバー範囲**:
  - 正常系: ユーザー登録・ログインが成功すること
  - 異常系: 重複登録の防止、バリデーションエラー処理
  - 権限: ADMIN/USER roleの適切な割り当て

#### 2. **NFT発行機能のテスト（NftService）**
- **意図**: CheeRainの中核機能であり、ビジネスロジック（ポイント計算、コンテンツモデレーション）の正確性を担保
- **カバー範囲**:
  - 正常系: NFT作成とポイント付与
  - 異常系: 不適切なコンテンツの検出、存在しないユーザーのエラー
  - ビジネスロジック: 支払い金額に応じたポイント計算の検証

#### 3. **コンテンツモデレーションのテスト（contentModeration.ts）**
- **意図**: ユーザー投稿の品質を保つため、NGワード検出ロジックの正確性を検証
- **カバー範囲**:
  - NGワード検出（暴言、差別的表現、過度な批判）
  - 警告ワード検出
  - 画像バリデーション（ファイルサイズ、形式チェック）

#### 4. **UIコンポーネントのテスト（Header.tsx）**
- **意図**: ユーザーインターフェースの視覚的・機能的整合性を確認
- **カバー範囲**:
  - ログイン状態による表示切り替え
  - ナビゲーションリンクの動作
  - モバイルメニューの開閉

#### 5. **E2Eテスト（Playwright）**
- **意図**: 実際のユーザー操作を模倣し、システム全体の動作を確認
- **カバー範囲**:
  - トップページの表示と基本ナビゲーション
  - 認証フロー（ユーザー登録・ログイン）
  - ページ遷移の正常性

---

## 🔍 テストカバレッジの考え方

### 目標
- **バックエンド**: 主要なサービス層とコントローラー層で70%以上
- **フロントエンド**: 重要なコンポーネントとユーティリティで60%以上
- **E2E**: 主要ユーザーフロー2〜3本

### 優先順位
1. **高優先度**: 認証、NFT発行、決済ロジック
2. **中優先度**: コンテンツモデレーション、ユーザー管理
3. **低優先度**: UIの細かいスタイリング、補助的な機能

**注**: 100%カバレッジを目指すのではなく、「実務で重要な部分を適切にテストする」ことを重視しています。

---

## 🛠️ トラブルシューティング

### よくある問題

#### 1. Jestテストが失敗する
```bash
# node_modulesをクリーンインストール
rm -rf node_modules package-lock.json
npm install
```

#### 2. Playwrightブラウザが見つからない
```bash
# ブラウザを再インストール
npx playwright install
```

#### 3. バックエンドテストがDBエラーで失敗する
- `src/test/resources/application.properties` でH2データベース設定を確認
- テスト実行前に `./mvnw clean` を実行

#### 4. E2Eテストがタイムアウトする
- バックエンドとフロントエンドが正常に起動しているか確認
- `playwright.config.ts` のタイムアウト設定を調整

---

## 📚 参考リソース

- [Spring Boot Testing](https://spring.io/guides/gs/testing-web/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)

---

## 🤝 貢献ガイドライン

### 新しいテストを追加する場合
1. テスト対象の機能が何をするかを明確に理解する
2. 正常系・異常系の両方をテストする
3. テストケース名は日本語でわかりやすく記述する
4. 必要に応じてモックを活用し、テストを高速化する

### テストを実行してからコミットする
```bash
# コミット前に必ずテストを実行
npm test && cd backend && ./mvnw test && cd ..
```

---

Built with ❤️ for ギラヴァンツ北九州 by チーム糸島
