/**
 * デフォルトNFT画像生成ユーティリティ
 * サッカー/Jリーグ/ギラヴァンツ北九州テーマ
 */

export interface DefaultImage {
  id: number;
  name: string;
  emoji: string;
  bgColor: string;
  textColor: string;
}

export const defaultImages: DefaultImage[] = [
  {
    id: 1,
    name: 'サッカーボール',
    emoji: '⚽',
    bgColor: '#DC2626', // red-600
    textColor: '#FEF3C7', // yellow-100
  },
  {
    id: 2,
    name: 'スタジアム',
    emoji: '🏟️',
    bgColor: '#FBBF24', // yellow-400
    textColor: '#991B1B', // red-800
  },
  {
    id: 3,
    name: 'ゴール',
    emoji: '🥅',
    bgColor: '#2563EB', // blue-600
    textColor: '#FEF3C7', // yellow-100
  },
  {
    id: 4,
    name: 'ユニフォーム',
    emoji: '👕',
    bgColor: '#059669', // green-600
    textColor: '#FFFFFF', // white
  },
  {
    id: 5,
    name: 'トロフィー',
    emoji: '🏆',
    bgColor: '#F59E0B', // amber-500
    textColor: '#78350F', // amber-900
  },
  {
    id: 6,
    name: 'スター',
    emoji: '⭐',
    bgColor: '#7C3AED', // violet-600
    textColor: '#FEF3C7', // yellow-100
  },
  {
    id: 7,
    name: '炎',
    emoji: '🔥',
    bgColor: '#EA580C', // orange-600
    textColor: '#FFFBEB', // amber-50
  },
  {
    id: 8,
    name: '稲妻',
    emoji: '⚡',
    bgColor: '#06B6D4', // cyan-500
    textColor: '#164E63', // cyan-900
  },
  {
    id: 9,
    name: '応援',
    emoji: '💪',
    bgColor: '#EC4899', // pink-500
    textColor: '#FFFFFF', // white
  },
  {
    id: 10,
    name: '旗',
    emoji: '🎌',
    bgColor: '#8B5CF6', // purple-500
    textColor: '#F3E8FF', // purple-100
  },
];

/**
 * SVG形式でデフォルト画像を生成
 */
export function generateDefaultImageSVG(imageId: number): string {
  const image = defaultImages.find(img => img.id === imageId);
  if (!image) {
    return generateDefaultImageSVG(1); // フォールバック
  }

  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${imageId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${image.bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustBrightness(image.bgColor, -20)};stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- 背景 -->
      <rect width="400" height="400" fill="url(#grad${imageId})"/>

      <!-- パターン装飾 -->
      <circle cx="50" cy="50" r="80" fill="${image.textColor}" opacity="0.1"/>
      <circle cx="350" cy="350" r="100" fill="${image.textColor}" opacity="0.1"/>
      <circle cx="320" cy="80" r="60" fill="${image.textColor}" opacity="0.08"/>

      <!-- 絵文字 -->
      <text x="200" y="220" font-size="120" text-anchor="middle" dominant-baseline="middle">
        ${image.emoji}
      </text>

      <!-- テキスト -->
      <text x="200" y="320" font-size="24" font-weight="bold" text-anchor="middle" fill="${image.textColor}">
        ${image.name}
      </text>

      <!-- ボーダー -->
      <rect x="10" y="10" width="380" height="380" fill="none" stroke="${image.textColor}" stroke-width="4" opacity="0.3"/>
    </svg>
  `.trim();

  return svg;
}

/**
 * Base64エンコードされたデータURLを生成
 */
export function generateDefaultImageDataURL(imageId: number): string {
  const svg = generateDefaultImageSVG(imageId);
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * 色の明るさを調整
 */
function adjustBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

/**
 * ランダムなデフォルト画像を取得
 */
export function getRandomDefaultImage(): DefaultImage {
  const randomIndex = Math.floor(Math.random() * defaultImages.length);
  return defaultImages[randomIndex];
}

/**
 * ランダムなデフォルト画像のDataURLを取得
 */
export function getRandomDefaultImageDataURL(): string {
  const randomImage = getRandomDefaultImage();
  return generateDefaultImageDataURL(randomImage.id);
}
