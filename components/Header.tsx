'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <header className="bg-red-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-yellow-300 cursor-pointer hover:text-yellow-200 transition tracking-wider">
            CHEERAIN
          </h1>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/nfts"
            className="px-4 py-2 text-yellow-100 hover:text-yellow-300 transition font-bold tracking-wide"
          >
            NFT一覧
          </Link>
          <Link
            href="/mypage"
            className="px-4 py-2 text-yellow-100 hover:text-yellow-300 transition font-bold tracking-wide"
          >
            マイページ
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-yellow-300 hover:from-purple-700 hover:to-purple-800 transition font-black tracking-wide border-2 border-yellow-400"
            >
              🔧 管理画面
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="px-4 py-2 text-yellow-300 font-bold text-sm">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-bold text-yellow-100 hover:text-yellow-300 transition tracking-wide"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-yellow-400 text-red-900 hover:bg-yellow-300 transition font-black border-2 border-red-700 tracking-wide"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
