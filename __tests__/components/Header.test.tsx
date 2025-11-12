import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}))

describe('Header コンポーネント', () => {
  const mockPush = jest.fn()
  const mockLogout = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  test('ログインしていない状態では「ログイン」ボタンが表示される', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAdmin: false,
      logout: mockLogout,
    })

    render(<Header />)

    expect(screen.getAllByText('ログイン').length).toBeGreaterThan(0)
    expect(screen.queryByText('ログアウト')).not.toBeInTheDocument()
  })

  test('ログイン済みの状態ではユーザーのメールアドレスが表示される', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com', userId: 1, role: 'USER', points: 100 },
      isAdmin: false,
      logout: mockLogout,
    })

    render(<Header />)

    expect(screen.getAllByText('test@example.com').length).toBeGreaterThan(0)
    expect(screen.getAllByText('ログアウト').length).toBeGreaterThan(0)
  })

  test('管理者の場合は「管理画面」リンクが表示される', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { email: 'admin@example.com', userId: 1, role: 'ADMIN', points: 100 },
      isAdmin: true,
      logout: mockLogout,
    })

    render(<Header />)

    const adminLinks = screen.getAllByText(/管理画面/)
    expect(adminLinks.length).toBeGreaterThan(0)
  })

  test('ログアウトボタンをクリックするとログアウト処理が実行される', async () => {
    mockLogout.mockResolvedValue(undefined)
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com', userId: 1, role: 'USER', points: 100 },
      isAdmin: false,
      logout: mockLogout,
    })

    render(<Header />)

    // デスクトップのログアウトボタンをクリック
    const logoutButtons = screen.getAllByText('ログアウト')
    fireEvent.click(logoutButtons[0])

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  test('「CHEERAIN」ロゴをクリックするとトップページに遷移する', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAdmin: false,
      logout: mockLogout,
    })

    render(<Header />)

    const logos = screen.getAllByText('CHEERAIN')
    expect(logos[0].closest('a')).toHaveAttribute('href', '/')
  })

  test('モバイルメニューの開閉が正常に動作する', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com', userId: 1, role: 'USER', points: 100 },
      isAdmin: false,
      logout: mockLogout,
    })

    render(<Header />)

    // 初期状態ではモバイルメニューは閉じている
    const mobileMenuLinks = screen.queryAllByText('試合結果')
    const visibleMobileLinks = mobileMenuLinks.filter(
      (link) => link.className.includes('block') && link.className.includes('md:hidden') === false
    )

    // ハンバーガーメニューボタンをクリックして開く
    const menuButton = screen.getByLabelText('メニュー')
    fireEvent.click(menuButton)

    // メニューが表示される
    const matchLinks = screen.getAllByText('試合結果')
    expect(matchLinks.length).toBeGreaterThan(1) // デスクトップ + モバイル
  })

  test('すべての主要ナビゲーションリンクが表示される', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com', userId: 1, role: 'USER', points: 100 },
      isAdmin: false,
      logout: mockLogout,
    })

    render(<Header />)

    expect(screen.getAllByText('ブロックチェーンNFT').length).toBeGreaterThan(0)
    expect(screen.getAllByText('試合結果').length).toBeGreaterThan(0)
    expect(screen.getAllByText('マイページ').length).toBeGreaterThan(0)
  })
})
