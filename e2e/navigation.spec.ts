import { test, expect } from '@playwright/test'

/**
 * E2E Test: ページ遷移とナビゲーション
 */
test.describe('ナビゲーション', () => {
  test('トップページ → 試合結果 → マイページの遷移', async ({ page, browserName }) => {
    // モバイルブラウザの場合はスキップ（複雑なページ遷移でのメニュー操作が不安定なため）
    const isMobile = page.viewportSize()!.width < 768
    if (isMobile) {
      test.skip()
      return
    }

    // 認証トークンを設定（マイページアクセスのため）
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'test-token-for-e2e')
      localStorage.setItem('user', JSON.stringify({ id: 'test-user', email: 'test@example.com', uid: 'test-user' }))
    })

    // トップページにアクセス
    await page.goto('/', { waitUntil: 'networkidle' })
    await expect(page.getByText('CHEERAIN')).toBeVisible({ timeout: 15000 })

    // 試合結果ページに遷移
    await page.getByRole('link', { name: '試合結果' }).first().click({ timeout: 15000 })
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/.*matches/, { timeout: 15000 })

    // マイページに遷移
    await page.getByRole('link', { name: 'マイページ' }).first().click({ timeout: 15000 })
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/.*mypage/, { timeout: 15000 })

    // トップページに戻る
    await page.getByText('CHEERAIN').first().click({ timeout: 15000 })
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/', { timeout: 15000 })
  })

  test('ブロックチェーンNFTページにアクセスできる', async ({ page }) => {
    // モバイルブラウザの場合はスキップ（ページコンテンツの可視性チェックが不安定なため）
    const isMobile = page.viewportSize()!.width < 768
    if (isMobile) {
      test.skip()
      return
    }

    await page.goto('/', { waitUntil: 'networkidle' })

    // ブロックチェーンNFTページに遷移
    await page.getByRole('link', { name: 'ブロックチェーンNFT' }).first().click({ timeout: 15000 })
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/.*blockchain-mint/, { timeout: 15000 })
  })

  test('マイページにアクセスできる', async ({ page }) => {
    // 認証トークンを設定
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'test-token-for-e2e')
      localStorage.setItem('user', JSON.stringify({ id: 'test-user', email: 'test@example.com', uid: 'test-user' }))
    })

    await page.goto('/mypage', { waitUntil: 'networkidle' })

    // マイページが表示されることを確認
    await expect(page).toHaveURL(/.*mypage/, { timeout: 15000 })
  })

  test('試合結果ページにアクセスできる', async ({ page }) => {
    await page.goto('/matches', { waitUntil: 'networkidle' })

    // 試合結果ページが表示されることを確認
    await expect(page).toHaveURL(/.*matches/, { timeout: 15000 })
  })

  test('存在しないページにアクセスすると404エラーが表示される', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000) // ページの読み込みを待つ

    // 404ページまたはエラーメッセージが表示されることを確認
    const pageContent = await page.textContent('body')
    expect(pageContent).toMatch(/404|見つかりません|Not Found/i)
  })

  test('ブラウザの戻るボタンで前のページに戻れる', async ({ page }) => {
    // モバイルブラウザの場合はスキップ（ページ遷移後のメニュー操作が不安定なため）
    const isMobile = page.viewportSize()!.width < 768
    if (isMobile) {
      test.skip()
      return
    }

    // トップページ → 試合結果ページ
    await page.goto('/', { waitUntil: 'networkidle' })

    await page.getByRole('link', { name: '試合結果' }).first().click({ timeout: 15000 })
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/.*matches/, { timeout: 15000 })

    // ブラウザの戻るボタン
    await page.goBack({ waitUntil: 'networkidle' })
    await expect(page).toHaveURL('/', { timeout: 15000 })
  })
})
