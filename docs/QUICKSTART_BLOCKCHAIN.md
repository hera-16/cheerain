# ブロックチェーンNFT発行 - クイックスタートガイド

5分でPolygon Amoy Testnet上にNFTを発行しましょう！

---

## ✅ 必要なもの

- ブラウザ（Chrome, Firefox, Braveなど）
- インターネット接続
- 5分の時間

---

## 🚀 ステップバイステップ

### ステップ1: MetaMaskをインストール (1分)

1. [MetaMask公式サイト](https://metamask.io/) にアクセス
2. 「Download」をクリック
3. ブラウザ拡張機能をインストール
4. 新しいウォレットを作成（または既存のウォレットをインポート）
5. **シードフレーズを安全に保存**（紙に書いて保管推奨）

---

### ステップ2: Polygon Amoy Testnetを追加 (30秒)

1. MetaMaskを開く
2. 左上のネットワーク選択をクリック
3. 「ネットワークを追加」→「ネットワークを手動で追加」
4. 以下の情報を入力:

```
ネットワーク名: Polygon Amoy Testnet
新しいRPC URL: https://rpc-amoy.polygon.technology
チェーンID: 80002
通貨記号: MATIC
ブロックエクスプローラーURL: https://amoy.polygonscan.com
```

5. 「保存」をクリック

---

### ステップ3: テストMATICを取得 (1分)

1. [Polygon Faucet](https://faucet.polygon.technology/) にアクセス
2. 「Polygon Amoy」を選択
3. MetaMaskアドレスをコピーして貼り付け
4. 「Submit」をクリック
5. 数秒〜数分待つ → テストMATICが付与されます

**うまくいかない場合:**
- [Alchemy Faucet](https://www.alchemy.com/faucets/polygon-amoy)
- [QuickNode Faucet](https://faucet.quicknode.com/polygon/amoy)

---

### ステップ4: WalletConnect Project IDを取得 (1分)

1. [Reown Cloud](https://cloud.reown.com/) にアクセス
2. GitHubアカウントでログイン
3. 「Create Project」をクリック
4. プロジェクト名を入力（例: `CheeRain`）
5. Project IDをコピー

---

### ステップ5: 環境変数を設定 (30秒)

`.env.local`ファイルをプロジェクトルートに作成し、以下を記入:

```env
# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=あなたのProject ID

# Polygon Amoy RPC
NEXT_PUBLIC_POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_CHAIN_ID=80002

# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

---

### ステップ6: スマートコントラクトをデプロイ (1分)

**重要**: デプロイ前に秘密鍵を設定する必要があります。

`.env`ファイルをプロジェクトルートに作成:

```env
PRIVATE_KEY=あなたのMetaMask秘密鍵
```

**秘密鍵の取得方法:**
1. MetaMaskを開く
2. アカウント詳細 → 秘密鍵のエクスポート
3. パスワードを入力
4. 秘密鍵をコピー（`0x...`の形式）

**⚠️ 警告**: 秘密鍵は絶対に公開しないでください！

ターミナルで実行:

```bash
# コントラクトをコンパイル
npx hardhat compile

# Polygon Amoy Testnetにデプロイ
npx hardhat run scripts/deploy.js --network polygonAmoy
```

デプロイが成功すると、コントラクトアドレスが表示されます:

```
✅ CheeRainNFTがデプロイされました!
📍 コントラクトアドレス: 0x1234567890abcdef...
```

---

### ステップ7: コントラクトアドレスを設定 (10秒)

`.env.local`に追加:

```env
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x1234567890abcdef...
```

（デプロイ時に表示されたアドレスをコピー）

---

### ステップ8: NFTを発行！ (1分)

1. 開発サーバーを起動（まだ起動していない場合）:
   ```bash
   npm run dev
   ```

2. ブラウザで開く:
   ```
   http://localhost:3000/blockchain-mint
   ```

3. 「ウォレットを接続」ボタンをクリック

4. MetaMaskを選択

5. 接続を承認

6. フォームに入力:
   - タイトル: `頑張れ！`
   - メッセージ: `次の試合も応援してます！`
   - 選手を選択
   - 画像を選択
   - 支払金額: `500`（円）

7. 「ブロックチェーンNFTを発行」をクリック

8. MetaMaskで署名

9. トランザクションが完了するまで待つ（数秒〜1分）

10. **完了！** 🎉

---

## 🔍 NFTを確認

### Polygonscan（Amoy）で確認

```
https://amoy.polygonscan.com/address/YOUR_CONTRACT_ADDRESS
```

### OpenSea Testnetで確認

```
https://testnets.opensea.io/assets/amoy/YOUR_CONTRACT_ADDRESS/TOKEN_ID
```

---

## 🎯 次のステップ

- 複数のNFTを発行してみる
- 選手別のNFTコレクションを作る
- 会場IDを入力して現地参加サポーター認定を受ける
- [詳細なセットアップガイド](BLOCKCHAIN_SETUP.md)を読む

---

## ❓ トラブルシューティング

### トランザクションが失敗する

- **原因**: ガス代不足、不正なパラメータ
- **解決策**: Faucetから追加のテストMATICを取得

### ウォレットが接続できない

- **原因**: ネットワーク設定が間違っている
- **解決策**: Polygon Amoy Testnetが選択されているか確認

### NFTが表示されない

- **原因**: トランザクションがまだ承認されていない
- **解決策**: Polygonscanでトランザクションステータスを確認し、数分待つ

---

## 📚 関連リンク

- [完全なセットアップガイド](BLOCKCHAIN_SETUP.md)
- [Polygon公式ドキュメント](https://docs.polygon.technology/)
- [MetaMaskガイド](https://support.metamask.io/)
- [Hardhatドキュメント](https://hardhat.org/docs)

---

🎉 おめでとうございます！ブロックチェーン上にNFTを発行できました！
