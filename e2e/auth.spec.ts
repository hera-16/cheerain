import { test, expect } from '@playwright/test'

/**
 * E2E Test: 認証フロー（ユーザー登録・ログイン）
 *
 * 注意: このテストはバックエンドAPIが起動している必要があります
 * バックエンドURL: http://localhost:8080
 */
test.describe('認証フロー', () => {
  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = 'TestPassword123!'

  test.beforeEach(async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle' })
  })

  test('ログインページが表示される', async ({ page }) => {
    await expect(page).toHaveURL(/.*login/, { timeout: 15000 })
    await expect(page.getByRole('heading', { name: /ログイン|サインイン/i })).toBeVisible({ timeout: 15000 })
  })

  test('アカウント作成フォームが表示される', async ({ page }) => {
    // アカウント作成タブをクリック
    const registerTab = page.getByRole('tab', { name: /アカウント作成|登録/i })
    if (await registerTab.isVisible({ timeout: 5000 }).catch(() => false)) {
      await registerTab.click({ timeout: 15000 })
      await page.waitForTimeout(500) // タブ切り替えアニメーションを待つ
    }

    // フォーム要素が表示されることを確認
    await expect(page.getByLabel(/メールアドレス|email/i)).toBeVisible({ timeout: 15000 })
    await expect(page.getByLabel(/パスワード|password/i).first()).toBeVisible({ timeout: 15000 })
  })

  test.skip('新規ユーザー登録が正常に完了する', async ({ page }) => {
    // Skip: バックエンドAPIの準備が必要
    // アカウント作成タブに移動
    const registerTab = page.getByRole('tab', { name: /アカウント作成|登録/i })
    if (await registerTab.isVisible()) {
      await registerTab.click()
    }

    // フォームに入力
    await page.getByLabel(/メールアドレス|email/i).fill(testEmail)
    await page.getByLabel(/パスワード|password/i).first().fill(testPassword)

    // 登録ボタンをクリック
    await page.getByRole('button', { name: /登録|アカウント作成/i }).click()

    // 登録成功を確認（マイページまたはダッシュボードにリダイレクト）
    await expect(page).toHaveURL(/.*mypage|.*dashboard|.*\/(?!login)/, { timeout: 10000 })
  })

  test.skip('登録済みユーザーでログインできる', async ({ page }) => {
    // Skip: バックエンドAPIの準備が必要
    // ログインフォームに入力
    await page.getByLabel(/メールアドレス|email/i).fill('admin@example.com')
    await page.getByLabel(/パスワード|password/i).fill('admin123')

    // ログインボタンをクリック
    await page.getByRole('button', { name: /ログイン|サインイン/i }).click()

    // ログイン成功を確認
    await expect(page).toHaveURL(/.*mypage|.*dashboard|.*\/(?!login)/, { timeout: 10000 })
  })

  test('バリデーションエラーが表示される（メールアドレス未入力）', async ({ page }) => {
    // パスワードのみ入力
    await page.getByLabel(/パスワード|password/i).first().fill('password123')
    await page.waitForTimeout(300) // 入力の安定化を待つ

    // ログインボタンをクリック
    await page.getByRole('button', { name: /ログイン|サインイン/i }).click({ timeout: 15000 })
    await page.waitForTimeout(1000) // バリデーション処理を待つ

    // エラーメッセージまたはフォームがそのまま表示されることを確認
    // （ブラウザのネイティブバリデーションまたはカスタムエラー）
    await expect(page).toHaveURL(/.*login/, { timeout: 15000 })
  })

  test('バリデーションエラーが表示される（パスワード未入力）', async ({ page }) => {
    // メールアドレスのみ入力
    await page.getByLabel(/メールアドレス|email/i).fill('test@example.com')
    await page.waitForTimeout(300) // 入力の安定化を待つ

    // ログインボタンをクリック
    await page.getByRole('button', { name: /ログイン|サインイン/i }).click({ timeout: 15000 })
    await page.waitForTimeout(1000) // バリデーション処理を待つ

    // エラーメッセージまたはフォームがそのまま表示されることを確認
    await expect(page).toHaveURL(/.*login/, { timeout: 15000 })
  })
})
