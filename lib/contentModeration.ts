/**
 * コンテンツモデレーション機能
 * NGワード検出と不適切なコンテンツのチェック
 */

// NGワードリスト（選手への過度な批判や不適切な表現）
const NG_WORDS = [
  // 暴言・誹謗中傷
  '死ね', 'しね', 'クズ', 'くず', 'ゴミ', 'ごみ', 'カス', 'かす',
  'バカ', 'ばか', 'アホ', 'あほ', '馬鹿', 'マヌケ', 'まぬけ',
  '無能', '役立たず', 'やめろ', '辞めろ', '引退しろ',

  // 差別的表現
  '差別', 'ブス', 'ブサイク', 'デブ', 'ハゲ', 'チビ',

  // 過度な批判
  '最悪', '最低', 'ダメ選手', 'へた', 'ヘタ', '下手くそ',
  '使えない', 'いらない', '不要',

  // 暴力的表現
  '殺', 'ぶっ', '蹴', 'なぐ', '叩', 'ボコボコ',

  // その他不適切
  '詐欺', 'さぎ', '八百長', 'やおちょう', '金返せ',
];

// 軽度の警告ワード（注意を促すが禁止はしない）
const WARNING_WORDS = [
  'もっと頑張れ', 'ダメ', '負け', '下手', 'へん',
];

/**
 * NGワードをチェックする
 * @param text チェックするテキスト
 * @returns NGワードが含まれている場合、そのワードと位置を返す
 */
export interface NgWordResult {
  isClean: boolean;
  foundWords: string[];
  warnings: string[];
}

export function checkNgWords(text: string): NgWordResult {
  const foundWords: string[] = [];
  const warnings: string[] = [];

  const lowerText = text.toLowerCase();

  // NGワードチェック
  for (const word of NG_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      foundWords.push(word);
    }
  }

  // 警告ワードチェック
  for (const word of WARNING_WORDS) {
    if (lowerText.includes(word.toLowerCase()) && !foundWords.length) {
      warnings.push(word);
    }
  }

  return {
    isClean: foundWords.length === 0,
    foundWords,
    warnings,
  };
}

/**
 * タイトルとメッセージの両方をチェックする
 */
export function checkTextContent(title: string, message: string): NgWordResult {
  const titleResult = checkNgWords(title);
  const messageResult = checkNgWords(message);

  return {
    isClean: titleResult.isClean && messageResult.isClean,
    foundWords: [...titleResult.foundWords, ...messageResult.foundWords],
    warnings: [...titleResult.warnings, ...messageResult.warnings],
  };
}

/**
 * 画像のモデレーションチェック（クライアント側での基本チェック）
 * サーバー側でより詳細なチェックを行うことを推奨
 */
export interface ImageCheckResult {
  isValid: boolean;
  error?: string;
}

export function checkImageBasic(file: File): ImageCheckResult {
  // ファイルサイズチェック（10MB制限）
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: '画像サイズが大きすぎます（最大10MB）',
    };
  }

  // ファイルタイプチェック
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'サポートされていない画像形式です（JPEG, PNG, GIF, WebPのみ）',
    };
  }

  return { isValid: true };
}

/**
 * 画像の内容をチェック（より高度なチェックはサーバー側で実施）
 * この関数は将来的にCloud Vision APIなどと統合する予定
 */
export async function checkImageContent(imageUrl: string): Promise<boolean> {
  // TODO: Cloud Vision APIや他の画像解析サービスと統合
  // 現在は基本的なチェックのみ

  // 画像がBase64の場合はスキップ（デフォルト画像）
  if (imageUrl.startsWith('data:')) {
    return true;
  }

  // サーバー側でのチェックを想定
  // ここではクライアント側での簡易チェックのみ
  return true;
}

/**
 * コメント用のモデレーションチェック
 */
export function checkComment(comment: string): NgWordResult {
  return checkNgWords(comment);
}
