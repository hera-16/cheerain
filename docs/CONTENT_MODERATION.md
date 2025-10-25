# コンテンツモデレーション機能

## 概要

選手への応援メッセージ（NFT発行時）に対して、不適切な内容が含まれていないかをチェックする機能です。

## 機能

### 1. NGワード検出

#### 対象となる不適切な表現
- **暴言・誹謗中傷**: 死ね、クズ、ゴミ、カス、バカ、アホ、無能、役立たず、やめろ、引退しろ など
- **差別的表現**: 差別、ブス、ブサイク、デブ、ハゲ、チビ など
- **過度な批判**: 最悪、最低、ダメ選手、下手くそ、使えない、いらない など
- **暴力的表現**: 殺、ぶっ、蹴、なぐ、叩、ボコボコ など
- **その他不適切**: 詐欺、八百長、金返せ など

#### 警告ワード
以下の表現は完全には禁止されませんが、ユーザーに確認を促します:
- もっと頑張れ、ダメ、負け、下手、へん など

### 2. 画像チェック

#### 基本チェック（クライアント側）
- **ファイルサイズ制限**: 最大10MB
- **ファイル形式制限**: JPEG, PNG, GIF, WebPのみ

#### 高度なチェック（将来実装予定）
- Cloud Vision APIやAI画像解析サービスによる不適切画像検出
- 現在は基本チェックのみ実装

## 実装

### フロントエンド

#### ファイル
- `cheerain/lib/contentModeration.ts`: モデレーション用ユーティリティ
- `cheerain/components/NFTMintForm.tsx`: NFT発行フォームにモデレーション統合

#### 使用方法

```typescript
import { checkTextContent, checkImageBasic } from '@/lib/contentModeration';

// テキストのチェック
const result = checkTextContent(title, message);
if (!result.isClean) {
  // NGワードが検出された
  console.log('検出されたNGワード:', result.foundWords);
}

// 画像のチェック
const imageCheck = checkImageBasic(file);
if (!imageCheck.isValid) {
  console.log('エラー:', imageCheck.error);
}
```

### バックエンド

#### ファイル
- `cheerain/backend/src/main/java/com/cheerain/service/ContentModerationService.java`: モデレーションサービス
- `cheerain/backend/src/main/java/com/cheerain/service/NftService.java`: NFT作成時にモデレーションチェックを実行

#### 使用方法

```java
@Autowired
private ContentModerationService contentModerationService;

// テキストのチェック
if (contentModerationService.checkTextContent(title, message)) {
    throw new IllegalArgumentException("不適切な内容が含まれています");
}

// NGワードのマスキング（将来的な機能）
String maskedText = contentModerationService.maskNgWords(text);
```

## チェックフロー

### NFT発行時

1. **クライアント側チェック**
   - タイトル・メッセージのNGワードチェック
   - NGワードが検出された場合: エラーメッセージを表示し、送信をブロック
   - 警告ワードが検出された場合: 確認ダイアログを表示し、ユーザーの判断に委ねる
   - 画像の基本チェック（サイズ・形式）

2. **サーバー側チェック**
   - タイトル・メッセージのNGワードチェック（二重チェック）
   - NGワードが検出された場合: 400エラーを返す

3. **エラーハンドリング**
   - クライアント側で詳細なエラーメッセージを表示
   - ユーザーに適切なメッセージの書き方をガイド

## UIの改善

### ガイドライン表示
応援メッセージ入力欄の下に、以下のガイドラインを表示:
- ✅ 選手を励まし、応援する前向きなメッセージを
- ✅ 暴言や過度な批判的な表現は避けてください
- ✅ 差別的な表現や誹謗中傷は禁止です

### エラーメッセージ
検出されたNGワードを具体的に表示し、ユーザーが修正しやすくする:
```
❌ 不適切な内容が検出されました

以下の表現が含まれています:
○○○, △△△

選手への応援は、前向きで建設的なメッセージでお願いします。
暴言や過度な批判的な表現は避けてください。
```

## 今後の拡張

### 1. AI画像解析
- Cloud Vision APIの統合
- 不適切な画像の自動検出
- 暴力的・性的な画像の検出

### 2. NGワードリストの管理
- 管理画面からNGワードの追加・削除
- カテゴリ別のNGワード管理
- 正規表現によるパターンマッチング

### 3. ユーザー報告機能
- 不適切なNFTの報告機能
- 報告されたNFTの自動非表示
- 管理者による審査機能

### 4. 機械学習による検出
- より高度な文脈理解
- 皮肉や婉曲表現の検出
- 多言語対応

## テスト

### 手動テスト手順

1. NFT発行フォームにアクセス
2. タイトルに「バカ」などのNGワードを入力
3. 「不適切な内容が検出されました」というエラーが表示されることを確認
4. NGワードを削除して正常に発行できることを確認
5. 10MBを超える画像をアップロードして、エラーが表示されることを確認

### 自動テスト（将来実装）
- ユニットテスト: NGワード検出ロジック
- 統合テスト: NFT発行APIのモデレーションチェック
- E2Eテスト: フロントエンドでのエラー表示

## 参考リンク
- [Google Cloud Vision API](https://cloud.google.com/vision)
- [AWS Rekognition](https://aws.amazon.com/jp/rekognition/)
