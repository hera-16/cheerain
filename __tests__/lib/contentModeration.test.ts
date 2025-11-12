import {
  checkNgWords,
  checkTextContent,
  checkImageBasic,
  checkComment,
} from '@/lib/contentModeration'

describe('contentModeration - NGワードチェック', () => {
  describe('checkNgWords', () => {
    test('クリーンなテキストではisCleanがtrueを返す', () => {
      const result = checkNgWords('いつも応援しています!頑張ってください!')
      expect(result.isClean).toBe(true)
      expect(result.foundWords).toHaveLength(0)
    })

    test('NGワードを含むテキストではisCleanがfalseを返す', () => {
      const result = checkNgWords('バカな選手だ')
      expect(result.isClean).toBe(false)
      expect(result.foundWords).toContain('バカ')
    })

    test('複数のNGワードが検出される', () => {
      const result = checkNgWords('クズでゴミな選手')
      expect(result.isClean).toBe(false)
      expect(result.foundWords.length).toBeGreaterThanOrEqual(2)
      expect(result.foundWords).toContain('クズ')
      expect(result.foundWords).toContain('ゴミ')
    })

    test('大文字小文字を区別せずにNGワードを検出する', () => {
      const result = checkNgWords('バカだよ')
      expect(result.isClean).toBe(false)
      expect(result.foundWords).toContain('バカ')
    })

    test('警告ワードが検出される（NGワードがない場合のみ）', () => {
      const result = checkNgWords('もっと頑張れよ')
      expect(result.isClean).toBe(true) // NGワードではないのでtrue
      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings).toContain('もっと頑張れ')
    })

    test('NGワードがある場合は警告ワードは無視される', () => {
      const result = checkNgWords('バカでもっと頑張れ')
      expect(result.isClean).toBe(false)
      expect(result.foundWords).toContain('バカ')
      expect(result.warnings).toHaveLength(0)
    })
  })

  describe('checkTextContent', () => {
    test('タイトルとメッセージの両方がクリーンな場合', () => {
      const result = checkTextContent('応援メッセージ', '頑張ってください!')
      expect(result.isClean).toBe(true)
      expect(result.foundWords).toHaveLength(0)
    })

    test('タイトルにNGワードが含まれる場合', () => {
      const result = checkTextContent('バカな選手', '応援します')
      expect(result.isClean).toBe(false)
      expect(result.foundWords).toContain('バカ')
    })

    test('メッセージにNGワードが含まれる場合', () => {
      const result = checkTextContent('応援メッセージ', 'クズだな')
      expect(result.isClean).toBe(false)
      expect(result.foundWords).toContain('クズ')
    })

    test('タイトルとメッセージの両方にNGワードが含まれる場合', () => {
      const result = checkTextContent('最悪の選手', 'ゴミすぎる')
      expect(result.isClean).toBe(false)
      expect(result.foundWords.length).toBeGreaterThanOrEqual(2)
    })

    test('タイトルとメッセージの両方に警告ワードが含まれる場合', () => {
      const result = checkTextContent('もっと頑張れ', '負けるなよ')
      expect(result.isClean).toBe(true) // NGワードではないのでtrue
      expect(result.warnings.length).toBeGreaterThan(0)
    })
  })

  describe('checkComment', () => {
    test('クリーンなコメント', () => {
      const result = checkComment('素晴らしいプレーでした!')
      expect(result.isClean).toBe(true)
    })

    test('NGワードを含むコメント', () => {
      const result = checkComment('やめろよ無能')
      expect(result.isClean).toBe(false)
      expect(result.foundWords.length).toBeGreaterThan(0)
    })
  })

  describe('checkImageBasic', () => {
    test('有効な画像ファイル（JPEG）', () => {
      const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }) // 1MB

      const result = checkImageBasic(file)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    test('有効な画像ファイル（PNG）', () => {
      const file = new File(['dummy'], 'test.png', { type: 'image/png' })
      Object.defineProperty(file, 'size', { value: 2 * 1024 * 1024 }) // 2MB

      const result = checkImageBasic(file)
      expect(result.isValid).toBe(true)
    })

    test('ファイルサイズが大きすぎる場合はエラー', () => {
      const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 }) // 11MB

      const result = checkImageBasic(file)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('画像サイズが大きすぎます')
    })

    test('サポートされていない画像形式の場合はエラー', () => {
      const file = new File(['dummy'], 'test.bmp', { type: 'image/bmp' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }) // 1MB

      const result = checkImageBasic(file)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('サポートされていない画像形式')
    })

    test('許可されている画像形式（WebP）', () => {
      const file = new File(['dummy'], 'test.webp', { type: 'image/webp' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }) // 1MB

      const result = checkImageBasic(file)
      expect(result.isValid).toBe(true)
    })
  })
})
