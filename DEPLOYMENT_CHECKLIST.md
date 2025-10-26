# CheeRain デプロイチェックリスト

このチェックリストに従ってデプロイを進めてください。

---

## 📋 事前準備

### アカウント作成
- [ ] GitHubアカウント（既存）
- [ ] Vercelアカウント作成 → https://vercel.com/signup
- [ ] Railwayアカウント作成 → https://railway.app/
- [ ] Firebaseプロジェクト確認
- [ ] Reown Project ID取得 → https://cloud.reown.com/

### 環境変数の収集
- [ ] Firebase設定情報（7個）を取得
- [ ] WalletConnect Project IDを取得
- [ ] NFTコントラクトアドレスを確認
- [ ] JWT Secret生成（`openssl rand -base64 64`）

---

## 🚂 Railway - バックエンド

### MySQLデータベース

- [ ] 1. Railwayプロジェクト作成
- [ ] 2. MySQLサービス追加（「+ New」→「Database」→「MySQL」）
- [ ] 3. MySQL接続情報を確認（Variables タブ）
  - `MYSQLHOST`
  - `MYSQLPORT`
  - `MYSQLDATABASE`
  - `MYSQLUSER`
  - `MYSQLPASSWORD`

### バックエンドサービス

- [ ] 4. GitHub repo追加（`hera-16/cheerain`）
- [ ] 5. Root Directory設定: `backend`
- [ ] 6. 環境変数設定（Variables タブ）
  ```
  DB_HOST=${{MySQL.MYSQLHOST}}
  DB_PORT=${{MySQL.MYSQLPORT}}
  DB_NAME=${{MySQL.MYSQLDATABASE}}
  DB_USERNAME=${{MySQL.MYSQLUSER}}
  DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
  JWT_SECRET=（生成したシークレット）
  JWT_EXPIRATION=86400000
  SERVER_PORT=$PORT
  SPRING_PROFILES_ACTIVE=prod
  ALLOWED_ORIGINS=https://cheerain.vercel.app,https://*.vercel.app
  ```
- [ ] 7. Build設定確認
  - Build Command: `mvn clean package -DskipTests`
  - Start Command: `java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/cheerain-backend-1.0.0.jar`
- [ ] 8. デプロイ実行（自動）
- [ ] 9. デプロイ完了確認（Logs タブ）
- [ ] 10. カスタムドメイン生成（Settings → Domains → Generate Domain）
- [ ] 11. **バックエンドURL をメモ**: `https://_____________.railway.app`

### データベース初期化

- [ ] 12. MySQL Data タブで接続
- [ ] 13. 以下のSQLファイルを実行
  - `backend/setup_database.sql`
  - `backend/update_players.sql`
  - `backend/init-matches.sql`

### 動作確認

- [ ] 14. ヘルスチェック: `curl https://your-backend.railway.app/actuator/health`
- [ ] 15. 選手API: `curl https://your-backend.railway.app/api/v1/players`
- [ ] 16. レスポンスが返ることを確認

---

## 🔺 Vercel - フロントエンド

### プロジェクト作成

- [ ] 1. Vercel Dashboard → 「Add New」→「Project」
- [ ] 2. GitHub repo選択: `hera-16/cheerain`
- [ ] 3. Framework: Next.js（自動検出）
- [ ] 4. Root Directory: `./`（そのまま）
- [ ] 5. Build設定確認
  - Build Command: `npm run build`
  - Output Directory: `.next`

### 環境変数設定

- [ ] 6. 環境変数追加（Environment Variables）

#### Firebase（7個）
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

#### Web3（4個）
```
NEXT_PUBLIC_POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=
```

#### Backend API（⭐️ 重要 - Railwayから取得したURL）
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app/api/v1
```

- [ ] 7. すべての環境変数で「All (Production, Preview, Development)」を選択

### デプロイ実行

- [ ] 8. 「Deploy」をクリック
- [ ] 9. ビルド完了を待つ（2〜5分）
- [ ] 10. デプロイ成功を確認
- [ ] 11. **VercelURL をメモ**: `https://_____________.vercel.app`

### Firebase設定更新

- [ ] 12. Firebase Console → Authentication → Settings → Authorized domains
- [ ] 13. Vercelドメインを追加:
  - `cheerain.vercel.app`
  - `*.vercel.app`

---

## ✅ 統合テスト

### API疎通確認

- [ ] 1. ブラウザで https://cheerain.vercel.app にアクセス
- [ ] 2. トップページが表示される
- [ ] 3. 選手一覧が表示される（バックエンドAPIから取得）

### 機能確認

- [ ] 4. ユーザー登録ができる
- [ ] 5. ログインができる
- [ ] 6. ウォレット接続ができる（MetaMask）
- [ ] 7. NFT発行ページにアクセスできる
- [ ] 8. マイページが表示される

### ブラウザコンソール確認

- [ ] 9. F12でコンソールを開く
- [ ] 10. エラーがないことを確認
- [ ] 11. CORS警告がないことを確認

### データベース確認

- [ ] 12. Railwayログで「HikariPool」接続を確認
- [ ] 13. エラーログがないことを確認

---

## 🔐 セキュリティ確認

- [ ] JWT_SECRETが強力なランダム値である
- [ ] データベースパスワードが自動生成値である
- [ ] `.env`ファイルがGitにコミットされていない
- [ ] 本番環境で`spring.jpa.show-sql=false`である
- [ ] CORSが必要なドメインのみ許可されている

---

## 📝 デプロイ記録

### 本番環境URL

**フロントエンド**: https://_________________.vercel.app

**バックエンド**: https://_________________.railway.app

### デプロイ情報

- **デプロイ日時**: YYYY-MM-DD HH:MM
- **担当者**:
- **Gitコミット**: `git rev-parse HEAD`
- **備考**:

---

## 🎉 完了！

すべてのチェックが完了したら、デプロイ成功です！

次のステップ:
1. ユーザーにURLを共有
2. 監視・ログ設定
3. バックアップ設定
4. パフォーマンス最適化

---

## 📞 トラブルシューティング

問題が発生した場合:
1. [DEPLOYMENT_COMPLETE_GUIDE.md](./DEPLOYMENT_COMPLETE_GUIDE.md) の「トラブルシューティング」を参照
2. Railwayのログを確認
3. Vercelのビルドログを確認
4. ブラウザのコンソールエラーを確認
