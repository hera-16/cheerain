# CheeRain デプロイクイックスタート

本番環境へのデプロイを最速で完了させるためのガイドです。

---

## 🚀 クイックスタート（30分で完了）

### ステップ1: Railway - バックエンド（15分）

1. **Railwayアカウント作成**: https://railway.app/
2. **新規プロジェクト**: 「Deploy from GitHub repo」→ `hera-16/cheerain`
3. **MySQL追加**: 「+ New」→「Database」→「MySQL」
4. **バックエンド設定**:
   - Settings → Root Directory: `backend`
   - Variables → 環境変数を設定（下記参照）
5. **デプロイ**: 自動で開始
6. **URL取得**: Settings → Domains → Generate Domain

#### 必要な環境変数（Railway）

```bash
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
JWT_SECRET=your-strong-jwt-secret-here
JWT_EXPIRATION=86400000
SERVER_PORT=$PORT
SPRING_PROFILES_ACTIVE=prod
ALLOWED_ORIGINS=https://cheerain.vercel.app,https://*.vercel.app
```

### ステップ2: Vercel - フロントエンド（15分）

1. **Vercelアカウント作成**: https://vercel.com/signup
2. **新規プロジェクト**: Import Git Repository → `hera-16/cheerain`
3. **環境変数設定**: Environment Variables で追加（下記参照）
4. **デプロイ**: 「Deploy」をクリック

#### 必要な環境変数（Vercel）

```bash
# Firebase（7個）
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Web3（4個）
NEXT_PUBLIC_POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=

# Backend API（Railwayから取得）
NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app/api/v1
```

---

## 📚 詳細ドキュメント

より詳しい手順は以下を参照：

1. **[完全デプロイガイド](./DEPLOYMENT_COMPLETE_GUIDE.md)** - すべての手順を網羅
2. **[デプロイチェックリスト](./DEPLOYMENT_CHECKLIST.md)** - チェック形式で確認
3. **[Vercelデプロイ手順](./DEPLOYMENT.md)** - フロントエンド詳細
4. **[Railwayデプロイ手順](./RAILWAY_DEPLOYMENT.md)** - バックエンド詳細

---

## 🎯 システム構成

```
Vercel (Frontend)  ──API──→  Railway (Backend)
     ↓                              ↓
 Firebase                    Railway MySQL
     ↓
Polygon Network (NFT)
```

---

## ✅ 動作確認

### バックエンド
```bash
curl https://your-backend.railway.app/actuator/health
```

### フロントエンド
ブラウザで https://your-app.vercel.app にアクセス

---

## 🆘 困ったら

1. [トラブルシューティング](./DEPLOYMENT_COMPLETE_GUIDE.md#トラブルシューティング)
2. Railwayログ確認
3. Vercelビルドログ確認

---

Happy Deploying! 🎉
