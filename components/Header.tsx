'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <header className="bg-red-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <h1 className="text-xl sm:text-2xl font-bold text-yellow-300 cursor-pointer hover:text-yellow-200 transition tracking-wider">
              CHEERAIN
            </h1>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/blockchain-mint"
              className="px-3 lg:px-4 py-2 text-yellow-100 hover:text-yellow-300 transition font-bold tracking-wide text-sm lg:text-base"
            >
              ブロックチェーンNFT
            </Link>
            <Link
              href="/matches"
              className="px-3 lg:px-4 py-2 text-yellow-100 hover:text-yellow-300 transition font-bold tracking-wide text-sm lg:text-base"
            >
              試合結果
            </Link>
            <Link
              href="/mypage"
              className="px-3 lg:px-4 py-2 text-yellow-100 hover:text-yellow-300 transition font-bold tracking-wide text-sm lg:text-base"
            >
              マイページ
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="px-3 lg:px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-yellow-300 hover:from-purple-700 hover:to-purple-800 transition font-black tracking-wide border-2 border-yellow-400 text-sm lg:text-base"
              >
                🔧 管理画面
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="px-2 lg:px-4 py-2 text-yellow-300 font-bold text-xs lg:text-sm truncate max-w-[120px] lg:max-w-none">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold text-yellow-100 hover:text-yellow-300 transition tracking-wide"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 lg:px-6 py-2 bg-yellow-400 text-red-900 hover:bg-yellow-300 transition font-black border-2 border-red-700 tracking-wide text-sm lg:text-base"
              >
                ログイン
              </Link>
            )}
          </nav>

          {/* モバイルハンバーガーボタン */}
          <button
            className="md:hidden text-yellow-300 hover:text-yellow-200 transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="メニュー"
          >
            {isMobileMenuOpen ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* モバイルメニュー */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t-2 border-yellow-400 pt-4 space-y-2">
            <Link
              href="/blockchain-mint"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-yellow-100 hover:bg-red-800 transition font-bold tracking-wide rounded"
            >
              ブロックチェーンNFT
            </Link>
            <Link
              href="/matches"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-yellow-100 hover:bg-red-800 transition font-bold tracking-wide rounded"
            >
              試合結果
            </Link>
            <Link
              href="/mypage"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-yellow-100 hover:bg-red-800 transition font-bold tracking-wide rounded"
            >
              マイページ
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-yellow-300 hover:from-purple-700 hover:to-purple-800 transition font-black tracking-wide border-2 border-yellow-400 rounded"
              >
                🔧 管理画面
              </Link>
            )}
            {user ? (
              <div className="space-y-2">
                <div className="px-4 py-2 text-yellow-300 font-bold text-sm border-t border-yellow-400 pt-4">
                  {user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-yellow-100 hover:bg-red-800 transition font-bold tracking-wide rounded"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 bg-yellow-400 text-red-900 hover:bg-yellow-300 transition font-black border-2 border-red-700 tracking-wide rounded text-center"
              >
                ログイン
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
