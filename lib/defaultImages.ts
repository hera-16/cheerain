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
 * SVG形式でデフォルト画像を生成（リアルで格好良いデザイン）
 */
export function generateDefaultImageSVG(imageId: number): string {
  const image = defaultImages.find(img => img.id === imageId);
  if (!image) {
    return generateDefaultImageSVG(1); // フォールバック
  }

  const darkColor = adjustBrightness(image.bgColor, -30);
  const lightColor = adjustBrightness(image.bgColor, 20);
  const shadowColor = adjustBrightness(image.bgColor, -50);

  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- メイングラデーション -->
        <linearGradient id="mainGrad${imageId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${lightColor};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${image.bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${darkColor};stop-opacity:1" />
        </linearGradient>

        <!-- ハイライトグラデーション -->
        <radialGradient id="highlight${imageId}" cx="30%" cy="30%">
          <stop offset="0%" style="stop-color:${image.textColor};stop-opacity:0.4" />
          <stop offset="70%" style="stop-color:${image.textColor};stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:${image.textColor};stop-opacity:0" />
        </radialGradient>

        <!-- シャドウグラデーション -->
        <radialGradient id="shadow${imageId}" cx="70%" cy="70%">
          <stop offset="0%" style="stop-color:${shadowColor};stop-opacity:0" />
          <stop offset="50%" style="stop-color:${shadowColor};stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:${shadowColor};stop-opacity:0.6" />
        </radialGradient>

        <!-- テキストシャドウフィルター -->
        <filter id="textShadow${imageId}">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dx="0" dy="2" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <!-- 3D効果のためのフィルター -->
        <filter id="3dEffect${imageId}">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
          <feOffset dx="0" dy="4" result="offsetblur"/>
          <feFlood flood-color="${shadowColor}" flood-opacity="0.6"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- 背景グラデーション -->
      <rect width="400" height="400" fill="url(#mainGrad${imageId})"/>

      <!-- シャドウオーバーレイ -->
      <rect width="400" height="400" fill="url(#shadow${imageId})"/>

      <!-- ハイライトオーバーレイ -->
      <rect width="400" height="400" fill="url(#highlight${imageId})"/>

      <!-- 幾何学パターン装飾 -->
      <g opacity="0.15">
        <circle cx="350" cy="50" r="120" fill="${image.textColor}"/>
        <circle cx="50" cy="350" r="140" fill="${image.textColor}"/>
        <polygon points="200,50 250,150 150,150" fill="${image.textColor}"/>
        <rect x="280" y="280" width="80" height="80" fill="${image.textColor}" transform="rotate(45 320 320)"/>
      </g>

      <!-- 六角形の背景枠 -->
      <g filter="url(#3dEffect${imageId})">
        <polygon
          points="200,60 290,110 290,210 200,260 110,210 110,110"
          fill="none"
          stroke="${image.textColor}"
          stroke-width="6"
          opacity="0.4"
        />
      </g>

      <!-- 絵文字アイコン（3D効果付き） -->
      <g filter="url(#3dEffect${imageId})">
        <text x="200" y="170" font-size="140" text-anchor="middle" dominant-baseline="middle" opacity="0.95">
          ${image.emoji}
        </text>
      </g>

      <!-- テキストラベル（影付き） -->
      <g filter="url(#textShadow${imageId})">
        <text
          x="200"
          y="330"
          font-size="28"
          font-weight="900"
          text-anchor="middle"
          fill="${image.textColor}"
          letter-spacing="2"
          style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        >
          ${image.name}
        </text>
      </g>

      <!-- 装飾的なボーダーライン -->
      <rect x="15" y="15" width="370" height="370" fill="none" stroke="${image.textColor}" stroke-width="3" opacity="0.5" rx="8"/>
      <rect x="8" y="8" width="384" height="384" fill="none" stroke="${image.textColor}" stroke-width="2" opacity="0.3" rx="12"/>

      <!-- 下部の装飾ライン -->
      <line x1="80" y1="300" x2="320" y2="300" stroke="${image.textColor}" stroke-width="2" opacity="0.3"/>

      <!-- コーナー装飾 -->
      <g opacity="0.4" stroke="${image.textColor}" stroke-width="3" fill="none">
        <polyline points="30,50 30,30 50,30"/>
        <polyline points="350,50 350,30 370,30"/>
        <polyline points="30,350 30,370 50,370"/>
        <polyline points="350,350 350,370 370,370"/>
      </g>
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
