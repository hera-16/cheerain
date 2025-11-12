# この内容をREADME.mdの適切な場所に追加してください

---

## 🧪 テストについて

CheeRainでは、実務レベルの品質担保を目的として、3層のテストを整備しています。

### テスト構成

#### 1. バックエンド（Spring Boot）
- **ユニットテスト**: JUnit 5 + Mockito
- **統合テスト**: MockMvc + Spring Boot Test
- **テストDB**: H2インメモリデータベース

#### 2. フロントエンド（Next.js）
- **コンポーネントテスト**: Jest + React Testing Library
- **ユーティリティテスト**: Jest

#### 3. E2Eテスト
- **Playwright**: TypeScriptネイティブ、複数ブラウザ対応

### テスト実行方法

```bash
# バックエンドのテスト
cd backend
./mvnw test

# フロントエンドのテスト
npm test

# カバレッジレポート生成
npm run test:coverage

# E2Eテスト（バックエンド・フロントエンドが起動している必要があります）
npm run test:e2e

# E2EテストをUIモードで実行
npm run test:e2e:ui
```

### CI/CD
GitHub Actionsで自動テストを実行しています。

- **トリガー**: push / pull_request（main, master, develop ブランチ）
- **ジョブ**: frontend-test, backend-test, e2e-test, build-check

詳細は [📖 テスト仕様書](./README_TESTING.md) を参照してください。

### テスト設計の意図

このプロジェクトのテストは、以下の目的で設計されています：

- **品質担保**: 主要機能（認証、NFT発行、コンテンツモデレーション）の正確性を保証
- **リグレッション防止**: 機能追加時に既存機能が壊れないことを確認
- **ドキュメント**: テストコードが仕様書としても機能
- **ポートフォリオ**: 新卒採用を意識し、「テストを設計・実装できる」能力を示す

**注**: 100%のテストカバレッジを目指すのではなく、代表的な機能を適切にテストすることを優先しています。

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

# テスト実行
npm test

# テスト（ウォッチモード）
npm run test:watch

# カバレッジレポート生成
npm run test:coverage

# E2Eテスト
npm run test:e2e

# E2Eテスト（UIモード）
npm run test:e2e:ui

# E2Eテスト（ヘッド付き）
npm run test:e2e:headed
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

# 特定のテストクラスを実行
./mvnw test -Dtest=AuthServiceTest

# Docker Composeで起動
docker-compose up -d

# Docker Composeで停止
docker-compose down

# ログ確認
docker-compose logs -f
```
