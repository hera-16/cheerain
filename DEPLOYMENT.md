# CheeRain - Vercelデプロイ手順書（フロントエンド）

## 📋 デプロイ前の準備

### 1. 必要なアカウント
- [x] GitHubアカウント
- [ ] Vercelアカウント（https://vercel.com/signup）
- [x] Firebaseプロジェクト
- [ ] Railwayアカウント（バックエンド用）

### 2. 環境変数の準備
以下の環境変数を用意してください（`.env.example`を参照）：

#### Firebase設定
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

#### Polygon/Web3設定
- `NEXT_PUBLIC_POLYGON_AMOY_RPC_URL`
- `NEXT_PUBLIC_CHAIN_ID`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS`

#### Backend API（Railwayからデプロイ後に設定）
- `NEXT_PUBLIC_API_BASE_URL`

---

## 🚀 Vercelへのデプロイ手順

### ステップ1: Vercelアカウントにログイン
1. https://vercel.com/ にアクセス
2. GitHubアカウントでサインイン

### ステップ2: 新規プロジェクトのインポート
1. Vercelダッシュボードで「Add New...」→「Project」をクリック
2. 「Import Git Repository」を選択
3. GitHubリポジトリ `hera-16/cheerain` を選択
4. 「Import」をクリック

### ステップ3: プロジェクト設定

#### Framework Preset
- **Framework**: Next.js（自動検出されます）

#### Build and Output Settings
- **Build Command**: `npm run build`（デフォルト）
- **Output Directory**: `.next`（デフォルト）
- **Install Command**: `npm install`（デフォルト）

#### Root Directory
- **Root Directory**: `./`（ルートディレクトリのまま）

### ステップ4: 環境変数の設定

「Environment Variables」セクションで、以下の変数を追加：

#### Firebase設定
```
NEXT_PUBLIC_FIREBASE_API_KEY=（Firebaseコンソールから取得）
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=（Firebaseコンソールから取得）
NEXT_PUBLIC_FIREBASE_PROJECT_ID=（Firebaseコンソールから取得）
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=（Firebaseコンソールから取得）
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=（Firebaseコンソールから取得）
NEXT_PUBLIC_FIREBASE_APP_ID=（Firebaseコンソールから取得）
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=（Firebaseコンソールから取得）
```

#### Web3/Blockchain設定
```
NEXT_PUBLIC_POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=（https://cloud.reown.com/から取得）
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=（デプロイ済みNFTコントラクトアドレス）
```

#### Backend API（Railwayデプロイ後に設定）
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app/api/v1
```

**重要**:
- すべての環境変数で「All (Production, Preview, Development)」を選択
- `NEXT_PUBLIC_API_BASE_URL`は、バックエンドをRailwayにデプロイした後に設定してください

### ステップ5: デプロイ実行
1. 「Deploy」ボタンをクリック
2. ビルドプロセスが開始されます（約2〜5分）
3. デプロイ完了後、URLが発行されます

---

## 🔧 Firebase設定の追加作業

### Firebaseコンソールでの設定

1. **Firebase Console** (https://console.firebase.google.com/) にアクセス
2. プロジェクト「cheerain-2a4b8」を選択
3. 「Authentication」→「Sign-in method」で認証方法を有効化
   - メール/パスワード認証を有効化
   - Google認証を有効化（オプション）

4. **承認済みドメインの追加**
   - 「Authentication」→「Settings」→「Authorized domains」
   - Vercelから発行されたドメイン（例: `cheerain.vercel.app`）を追加

5. **Firestoreセキュリティルールの確認**
   - 「Firestore Database」→「Rules」で以下のルールを設定：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーコレクション
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // 選手コレクション
    match /players/{playerId} {
      allow read: if true;
      allow write: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // NFTコレクション
    match /nfts/{nftId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
                               (resource.data.userId == request.auth.uid ||
                                get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

6. **Storage設定**
   - 「Storage」→「Rules」で画像アップロード用のルールを設定

---

## 📊 デプロイ後の確認事項

### 1. 動作確認
- [ ] トップページが正しく表示される
- [ ] ログイン/サインアップが動作する
- [ ] NFT発行機能が動作する
- [ ] Admin画面にアクセスできる（Admin権限ユーザー）

### 2. パフォーマンスチェック
- [ ] ページ読み込み速度を確認
- [ ] モバイルでの表示確認
- [ ] Lighthouse スコアの確認

### 3. セキュリティチェック
- [ ] 環境変数が正しく設定されている
- [ ] Firebase認証が正常に動作する
- [ ] Admin権限が正しく制御されている

---

## 🔄 継続的デプロイ（自動デプロイ）

Vercelは、GitHubリポジトリと自動的に連携します：

- **masterブランチへのpush**: 本番環境に自動デプロイ
- **他のブランチへのpush**: プレビュー環境を自動生成

### デプロイの流れ
```bash
# ローカルで開発
git add .
git commit -m "新機能追加"
git push origin master

# Vercelが自動的にデプロイを開始
# 完了後、本番環境が更新される
```

---

## 🛠️ トラブルシューティング

### ビルドエラーが発生した場合

1. **環境変数の確認**
   - Vercelダッシュボード → Settings → Environment Variables
   - すべての変数が正しく設定されているか確認

2. **ローカルでビルドテスト**
   ```bash
   cd cheerain
   npm run build
   ```

3. **ログの確認**
   - Vercelダッシュボード → Deployments → 失敗したデプロイをクリック
   - ビルドログを確認

### Firebase接続エラーの場合

1. Firebaseの承認済みドメインにVercelのURLを追加
2. 環境変数が正しく設定されているか確認
3. Firebaseコンソールで認証方法が有効になっているか確認

### TypeScriptエラーの場合

1. `npm install` を実行して依存関係を再インストール
2. `next.config.ts` の設定を確認
3. TypeScriptの型エラーを修正

---

## 📱 カスタムドメインの設定（オプション）

独自ドメインを使用する場合：

1. Vercelダッシュボード → Settings → Domains
2. 「Add」をクリックして独自ドメインを入力
3. DNS設定を指示に従って更新
4. SSL証明書が自動的に発行されます

---

## 🔐 セキュリティのベストプラクティス

1. **環境変数の管理**
   - `.env.local` を `.gitignore` に追加（すでに設定済み）
   - 本番環境の環境変数は必ずVercelダッシュボードで設定

2. **Firebase設定**
   - Firestoreセキュリティルールを厳格に設定
   - 本番環境では `allow read/write: if false;` から始める

3. **Admin権限**
   - Admin権限は必要最小限のユーザーにのみ付与
   - `scripts/setAdminRole.md` の手順に従って設定

---

## 📞 サポート

問題が発生した場合：
1. Vercelのドキュメント: https://vercel.com/docs
2. Next.jsのドキュメント: https://nextjs.org/docs
3. Firebaseのドキュメント: https://firebase.google.com/docs

---

**デプロイURL**: デプロイ完了後にここにURLを記載
**デプロイ日時**: YYYY-MM-DD HH:MM
**担当者**:
