# ブロックチェーンNFT発行セットアップガイド

このガイドでは、Polygon Amoy TestnetでCheeRainNFTを実際にブロックチェーン上に発行する方法を説明します。

## 🎯 概要

CheeRainは、応援メッセージをPolygonブロックチェーン上のNFTとして発行します。

- **ネットワーク**: Polygon Amoy Testnet
- **コントラクト標準**: ERC-721
- **費用**: テストネットのため完全無料（テストMATICを使用）

---

## ⚙️ セットアップ手順

### 1. MetaMaskウォレットの準備

#### 1.1 MetaMaskのインストール

- ブラウザ拡張機能として [MetaMask](https://metamask.io/) をインストール
- 新規ウォレットを作成、またはシードフレーズで復元

#### 1.2 Polygon Amoy Testnetの追加

MetaMaskにPolygon Amoy Testnetネットワークを追加します:

1. MetaMaskを開く
2. ネットワーク選択 → 「ネットワークを追加」
3. 手動でネットワークを追加:

```
ネットワーク名: Polygon Amoy Testnet
RPC URL: https://rpc-amoy.polygon.technology
チェーンID: 80002
通貨記号: MATIC
ブロックエクスプローラーURL: https://amoy.polygonscan.com
```

#### 1.3 テストMATICの取得（無料）

1. [Polygon Faucet](https://faucet.polygon.technology/) にアクセス
2. Polygon Amoyを選択
3. ウォレットアドレスを入力
4. 「Submit」をクリック
5. 数分でテストMATICが付与されます（通常0.5-1 MATIC）

**代替Faucet**:
- [Alchemy Polygon Faucet](https://www.alchemy.com/faucets/polygon-amoy)
- [QuickNode Faucet](https://faucet.quicknode.com/polygon/amoy)

---

### 2. スマートコントラクトのデプロイ

#### 2.1 環境変数の設定

`.env.local`ファイルに以下を追加:

```env
# Polygon Network
NEXT_PUBLIC_POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_CHAIN_ID=80002

# Reown AppKit (WalletConnect)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# デプロイ後に追加
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=
```

#### 2.2 WalletConnect Project IDの取得

1. [Reown Cloud](https://cloud.reown.com/) にアクセス
2. 「Create Project」をクリック
3. プロジェクト名を入力（例: CheeRain）
4. Project IDをコピーして`.env.local`に追加

#### 2.3 デプロイ用の秘密鍵を設定（オプション - CLIデプロイの場合）

**⚠️ 警告**: 秘密鍵は絶対に公開しないでください。テスト用ウォレットのみ使用してください。

```env
PRIVATE_KEY=your_private_key_here
```

MetaMaskから秘密鍵をエクスポート:
1. アカウント詳細 → 秘密鍵のエクスポート
2. パスワードを入力
3. 秘密鍵をコピー（先頭の`0x`を含む）

#### 2.4 コントラクトのコンパイルとデプロイ

**方法1: Hardhat CLIでデプロイ（推奨）**

```bash
# コントラクトをコンパイル
npx hardhat compile

# Polygon Amoyにデプロイ
npx hardhat run scripts/deploy.js --network polygonAmoy
```

デプロイ後、コントラクトアドレスが表示されます:

```
✅ CheeRainNFTがデプロイされました!
📍 コントラクトアドレス: 0x1234567890abcdef...
```

**方法2: Remix IDE（ブラウザベース）**

1. [Remix IDE](https://remix.ethereum.org/) にアクセス
2. `contracts/CheeRainNFT.sol`の内容をコピー
3. Remix上で新しいファイルを作成してペースト
4. 依存関係をインストール（@openzeppelin/contracts）
5. コンパイル（Solidity 0.8.20）
6. デプロイタブ → Environment: "Injected Provider - MetaMask"
7. MetaMaskでAmoy Testnetに接続
8. Deployをクリック

#### 2.5 デプロイされたコントラクトアドレスを設定

`.env.local`に追加:

```env
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x1234567890abcdef...
```

---

### 3. フロントエンドの設定

#### 3.1 Wagmi Config の作成

`lib/wagmi.ts`に以下を追加:

```typescript
import { createConfig, http } from 'wagmi'
import { polygonAmoy } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    }),
  ],
})
```

#### 3.2 Reown AppKitの初期化

`app/layout.tsx`でAppKitProviderをセットアップ（後述）

---

### 4. NFT発行の動作確認

#### 4.1 アプリケーションの起動

```bash
npm run dev
```

#### 4.2 ウォレットの接続

1. ブラウザで `http://localhost:3000` を開く
2. 「ウォレットを接続」ボタンをクリック
3. MetaMaskを選択
4. Polygon Amoy Testnetに接続されていることを確認

#### 4.3 NFTの発行

1. NFT発行フォームにアクセス
2. 応援メッセージを入力
3. 「NFTを発行」をクリック
4. MetaMaskでトランザクションを承認
5. トランザクションが完了するまで待機（数秒〜1分）
6. 発行成功！

#### 4.4 NFTの確認

**Polygonscan（Amoy）で確認:**

```
https://amoy.polygonscan.com/address/YOUR_CONTRACT_ADDRESS
```

**OpenSea Testnetで確認:**

```
https://testnets.opensea.io/assets/amoy/YOUR_CONTRACT_ADDRESS/TOKEN_ID
```

---

## 📊 コントラクト機能

### CheeRainNFTコントラクト

- **コントラクト名**: CheeRainNFT
- **シンボル**: CHEERAIN
- **標準**: ERC-721

### 主要メソッド

```solidity
// NFTを発行
function mintNFT(
    address to,
    string memory title,
    string memory message,
    string memory playerName,
    string memory imageUrl,
    uint256 paymentAmount,
    bool isVenueAttendee
) public returns (uint256)

// ユーザーのNFT一覧を取得
function getNFTsByUser(address user) public view returns (uint256[] memory)

// 選手別のNFT一覧を取得
function getNFTsByPlayer(string memory playerName) public view returns (uint256[] memory)

// NFTメタデータを取得
function getNFTMetadata(uint256 tokenId) public view returns (NFTMetadata memory)

// 総発行数を取得
function totalSupply() public view returns (uint256)
```

---

## 🔐 セキュリティとベストプラクティス

### テストネット vs メインネット

- **テストネット（Amoy）**:
  - 開発・テスト用
  - 無料で使用可能
  - トークンに価値はない

- **メインネット（Polygon PoS）**:
  - 本番環境
  - 実際のMATICが必要
  - NFTに実際の価値がある

### 秘密鍵の管理

- 秘密鍵は絶対にGitにコミットしない
- `.env.local`は`.gitignore`に追加済み
- 本番環境では環境変数として設定

### コントラクトのセキュリティ

- OpenZeppelinの監査済みコントラクトを使用
- Ownable パターンでアクセス制御
- Re-entrancy攻撃への対策済み

---

## 🚀 本番環境へのデプロイ（Polygon Mainnet）

本番環境にデプロイする際の追加手順:

### 1. 実際のMATICを取得

- 取引所でMATICを購入
- Polygon PoS（メインネット）にブリッジ

### 2. 環境変数を更新

```env
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
NEXT_PUBLIC_CHAIN_ID=137
```

### 3. コントラクトをメインネットにデプロイ

```bash
npx hardhat run scripts/deploy.js --network polygonMainnet
```

### 4. コントラクトの検証（Polygonscan）

```bash
npx hardhat verify --network polygonMainnet DEPLOYED_CONTRACT_ADDRESS
```

---

## 🛠️ トラブルシューティング

### よくある問題

#### 1. トランザクションが失敗する

**原因**: ガス代不足、または不正なパラメータ

**解決策**:
- MetaMaskの残高を確認
- Faucetからテストトークンを取得
- ガス価格を上げてリトライ

#### 2. ウォレットが接続できない

**原因**: ネットワーク設定が間違っている

**解決策**:
- MetaMaskでAmoy Testnetが選択されているか確認
- RPC URLとチェーンIDを再確認
- ブラウザをリロード

#### 3. NFTが表示されない

**原因**: トランザクションがまだ承認されていない

**解決策**:
- Polygonscanでトランザクションステータスを確認
- 数分待ってからリロード
- ブロック確認数を待つ（通常1-2ブロック）

---

## 📚 参考リソース

- [Hardhat ドキュメント](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Wagmi ドキュメント](https://wagmi.sh/)
- [Reown AppKit ドキュメント](https://docs.reown.com/appkit/)
- [Polygon ドキュメント](https://docs.polygon.technology/)
- [Polygonscan Amoy](https://amoy.polygonscan.com/)

---

## ✅ チェックリスト

セットアップが完了しているか確認してください:

- [ ] MetaMaskをインストール
- [ ] Polygon Amoy Testnetを追加
- [ ] テストMATICを取得（残高 > 0）
- [ ] WalletConnect Project IDを取得
- [ ] `.env.local`に環境変数を設定
- [ ] スマートコントラクトをデプロイ
- [ ] コントラクトアドレスを`.env.local`に追加
- [ ] フロントエンドでウォレット接続が成功
- [ ] NFTの発行テストが成功

---

🎉 セットアップが完了したら、実際にNFTを発行してみましょう！
