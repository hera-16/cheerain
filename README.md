# CheeRain（チアレイン）

**ファンの声を選手に届ける、新しい応援のカタチ**

ギラヴァンツ北九州の選手に応援メッセージを送ると、それがNFTカードとして永久保存される革新的な応援アプリです。

---

## 🎯 プロジェクト概要

CheeRainは、ファンが送った応援コメントをブロックチェーン上にNFTとして記録し、選手のモチベーション向上とファンエンゲージメント強化を実現するWebアプリケーションです。

### 主な機能

- **応援メッセージNFT発行**: 選手への応援メッセージをNFTとして永久保存
- **人気投票機能**: 応援数に基づいて人気選手をランキング表示
- **NFTコレクション**: 自分が発行したNFTを一覧で確認
- **Admin管理画面**: ユーザー・NFT・分析データの管理
- **QRコード発行**: NFTをQRコードで共有可能
- **デフォルト画像選択**: 複数のデザインから選択可能

---

## 🛠️ 技術スタック

### フロントエンド
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **React 19**

### バックエンド・インフラ
- **Firebase**
  - Authentication（メール/パスワード認証）
  - Firestore Database（NoSQLデータベース）
  - Storage（画像保存）
- **Vercel**（ホスティング）

### Web3関連
- **Wagmi** - Web3 React Hooks
- **Viem** - Ethereum library
- **Ethers.js** - Ethereum interaction
- **Polygon Network** - NFT発行（低ガス代）

---

## 📦 セットアップ

### 前提条件

- Node.js 18.x以上
- npm または yarn
- Firebaseプロジェクト（Firebase Console で作成）
- （オプション）MetaMask等のWeb3ウォレット

### インストール手順

1. **リポジトリのクローン**
```bash
git clone https://github.com/hera-16/cheerain.git
cd cheerain
```

2. **依存関係のインストール**
```bash
npm install
```

3. **環境変数の設定**

`.env.local`ファイルをプロジェクトルートに作成し、以下を設定してください：

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Polygon Network Configuration
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
NEXT_PUBLIC_CONTRACT_ADDRESS=your_nft_contract_address_here
```

**注意**: `.env.example`ファイルを参考にしてください。

4. **Firebaseの初期設定**

Firebase Consoleで以下を設定：
- Authentication: メール/パスワード認証を有効化
- Firestore Database: データベースを作成
- Storage: ストレージを有効化

5. **開発サーバーの起動**
```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

---

## 🚀 スクリプト・コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番環境起動
npm start

# Lint実行
npm run lint

# 選手データのシード（初期データ投入）
npm run seed:players
```

---

## 📁 プロジェクト構造

```
cheerain/
├── app/                    # Next.js App Router
│   ├── page.tsx            # トップページ
│   ├── layout.tsx          # ルートレイアウト
│   ├── login/              # ログイン・サインアップページ
│   ├── mypage/             # マイページ
│   ├── nfts/               # NFT一覧ページ
│   └── admin/              # Admin管理画面
│       ├── page.tsx        # Admin ダッシュボード
│       ├── users/          # ユーザー管理
│       ├── nfts/           # NFT管理
│       └── analytics/      # 分析画面
├── components/             # Reactコンポーネント
│   ├── Header.tsx          # ヘッダーコンポーネント
│   ├── NFTMintForm.tsx     # NFT発行フォーム
│   └── NFTGallery.tsx      # NFTギャラリー
├── contexts/               # React Context
│   └── AuthContext.tsx     # 認証コンテキスト
├── lib/                    # ユーティリティ・設定
│   ├── firebase.ts         # Firebase設定
│   └── defaultImages.ts    # デフォルト画像定義
├── types/                  # TypeScript型定義
│   ├── nft.ts              # NFT型
│   └── player.ts           # 選手型
├── scripts/                # スクリプト
│   ├── seedPlayers.ts      # 選手データシードスクリプト
│   └── setAdminRole.md     # Admin権限設定ガイド
├── public/                 # 静的ファイル
├── .env.local              # 環境変数（Git管理外）
├── .env.example            # 環境変数テンプレート
├── vercel.json             # Vercel設定
└── DEPLOYMENT.md           # デプロイ手順書
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

### Vercelへのデプロイ

詳細な手順は [`DEPLOYMENT.md`](DEPLOYMENT.md) を参照してください。

**簡易手順:**

1. Vercelアカウントを作成（GitHubでログイン）
2. GitHubリポジトリをインポート
3. 環境変数を設定（`.env.example`参照）
4. デプロイを実行

**重要**: 環境変数（Firebase設定など）を必ずVercelダッシュボードで設定してください。

---

## 📊 主要機能の説明

### 1. NFT発行機能
- ユーザーが選手への応援メッセージを入力
- デフォルト画像またはカスタム画像を選択
- Firestoreに保存し、NFTカードとして発行

### 2. マイページ
- 自分が発行したNFT一覧
- ユーザー統計（発行数、称号など）
- プロフィール画像のアップロード
- QRコード表示機能

### 3. Admin管理画面
- ユーザー管理（一覧・検索・role変更）
- NFT管理（一覧・削除）
- 分析機能（統計グラフ、人気選手ランキング）

### 4. 認証機能
- メール/パスワード認証（Firebase Authentication）
- ユーザー登録時にrole自動付与
- ログイン状態の永続化

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
