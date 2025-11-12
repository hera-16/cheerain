import { test, expect } from '@playwright/test'

/**
 * E2E Test: トップページの基本機能
 */
test.describe('トップページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
  })

  test('ページが正常に読み込まれる', async ({ page }) => {
    await expect(page).toHaveTitle(/CHEERAIN|CheeRain|Cheerain/, { timeout: 15000 })
  })

  test('ヘッダーにCHEERAINロゴが表示される', async ({ page }) => {
    const logo = page.getByText('CHEERAIN')
    await expect(logo).toBeVisible({ timeout: 15000 })
  })

  test('ログインボタンが表示される', async ({ page }) => {
    const loginButton = page.getByRole('link', { name: 'ログイン' })
    await expect(loginButton.first()).toBeVisible({ timeout: 15000 })
  })

  test('主要ナビゲーションリンクが機能する', async ({ page }) => {
    // モバイルビューの場合はメニューを開く
    const isMobile = page.viewportSize()!.width < 768
    if (isMobile) {
      const menuButton = page.getByLabel('メニュー')
      await expect(menuButton).toBeVisible({ timeout: 15000 })
      await menuButton.click({ timeout: 15000 })
      await page.waitForTimeout(500) // メニューアニメーションを待つ
    }

    // ブロックチェーンNFTリンクをクリック
    const blockchainLink = page.getByRole('link', { name: 'ブロックチェーンNFT' }).first()
    await expect(blockchainLink).toBeVisible({ timeout: 15000 })
    await blockchainLink.click({ timeout: 15000 })
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/.*blockchain-mint/, { timeout: 15000 })

    // トップページに戻る
    await page.goto('/', { waitUntil: 'networkidle' })

    // モバイルビューの場合はメニューを開く
    if (isMobile) {
      const menuButton = page.getByLabel('メニュー')
      await expect(menuButton).toBeVisible({ timeout: 15000 })
      await menuButton.click({ timeout: 15000 })
      await page.waitForTimeout(500)
    }

    // 試合結果リンクをクリック
    const matchesLink = page.getByRole('link', { name: '試合結果' }).first()
    await expect(matchesLink).toBeVisible({ timeout: 15000 })
    await matchesLink.click({ timeout: 15000 })
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/.*matches/, { timeout: 15000 })

    // トップページに戻る
    await page.goto('/', { waitUntil: 'networkidle' })

    // モバイルビューの場合はメニューを開く
    if (isMobile) {
      const menuButton = page.getByLabel('メニュー')
      await expect(menuButton).toBeVisible({ timeout: 15000 })
      await menuButton.click({ timeout: 15000 })
      await page.waitForTimeout(500)
    }

    // マイページリンクをクリック（未認証の場合はログインページにリダイレクトされる）
    const mypageLink = page.getByRole('link', { name: 'マイページ' }).first()
    await expect(mypageLink).toBeVisible({ timeout: 15000 })
    await mypageLink.click({ timeout: 15000 })
    await page.waitForLoadState('networkidle')
    // 未認証の場合はログインページまたはマイページのいずれかに遷移
    await expect(page).toHaveURL(/(.*mypage|.*login)/, { timeout: 15000 })
  })

  test('モバイルメニューが正常に動作する', async ({ page }) => {
    // モバイル表示にリサイズ
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(1000) // リサイズ後の安定化を待つ

    // ハンバーガーメニューボタンをクリック
    const menuButton = page.getByLabel('メニュー')
    await menuButton.click({ timeout: 15000 })
    await page.waitForTimeout(500) // メニューアニメーションを待つ

    // メニューが開いていることを確認
    const mobileMenu = page.locator('nav').filter({ hasText: 'ブロックチェーンNFT' }).last()
    await expect(mobileMenu).toBeVisible({ timeout: 15000 })

    // メニューを閉じる
    await menuButton.click()
    await page.waitForTimeout(500) // メニュー閉じるアニメーションを待つ
  })
})
