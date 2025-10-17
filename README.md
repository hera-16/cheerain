# Cheerain

**ファンの声を選手に届ける、新しい応援のカタチ**

ギラヴァンツ北九州の選手に応援メッセージを送ると、それがNFTカードとして永久保存される革新的な応援アプリです。

## 🎯 プロジェクト概要

Cheerainは、ファンが送った応援コメントをブロックチェーン上にNFTとして記録し、選手のモチベーション向上とファンエンゲージメント強化を実現するWebアプリケーションです。

### 主な機能

- 選手への応援メッセージ投稿
- 応援メッセージのNFT化（Polygon Network使用）
- 応援数に基づく人気投票機能
- NFT保有者限定特典（グッズ割引、北九州市内店舗優待など）
- 応援履歴・コレクション管理

## 🛠️ 技術スタック

### フロントエンド
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Wagmi** - Web3 React Hooks
- **Viem** - Ethereum library

### バックエンド
- **Firebase** - Authentication & Firestore Database
- **Polygon Network** - NFT発行（低ガス代）
- **Ethers.js** - Ethereum interaction

## 📦 セットアップ

### 前提条件

- Node.js 18.x以上
- npm または yarn
- MetaMask等のWeb3ウォレット

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/hera-16/cheerain.git
cd cheerain

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### 環境変数の設定

`.env.local`ファイルをプロジェクトルートに作成し、以下を設定してください：

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Polygon
NEXT_PUBLIC_POLYGON_RPC_URL=your_polygon_rpc_url
NEXT_PUBLIC_CONTRACT_ADDRESS=your_nft_contract_address
```

## 🚀 開発

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番環境起動
npm start

# Lint実行
npm run lint
```

## 📁 プロジェクト構造

```
cheerain/
├── app/              # Next.js App Router
│   ├── page.tsx      # トップページ
│   └── layout.tsx    # ルートレイアウト
├── components/       # Reactコンポーネント
├── lib/             # ユーティリティ・設定
│   ├── firebase.ts  # Firebase設定
│   └── wagmi.ts     # Wagmi設定
├── contracts/       # スマートコントラクト
├── public/          # 静的ファイル
└── styles/          # グローバルスタイル
```

## 🤝 コントリビューション

このプロジェクトは2人チームで開発中です。

## 📄 ライセンス

MIT License

## 🏆 ハッカソン情報

このプロジェクトは「ギラヴァンツ北九州ハッカソン」のために開発されています。

- **テーマ**: ファン創出 + 活動の盛り上げ + 旅行プラン連携
- **目標**: Web3技術でスポーツ応援の新しい形を創造

---

Built with ❤️ by Team hera-16
