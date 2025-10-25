'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('🔐 [Admin Layout] 権限チェック:', {
      loading,
      user: user?.email,
      isAdmin,
    });

    if (!loading && !user) {
      // 未ログインの場合はログインページへ
      console.log('🚫 [Admin Layout] 未ログイン - ログインページへリダイレクト');
      router.push('/login');
    } else if (!loading && user && !isAdmin) {
      // ログイン済みだがadmin権限がない場合はホームへ
      console.log('⛔ [Admin Layout] 管理者権限なし - ホームへリダイレクト');
      router.push('/');
      alert('管理者権限が必要です');
    } else if (!loading && user && isAdmin) {
      console.log('✅ [Admin Layout] 管理者権限あり - 管理画面表示');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl font-black text-yellow-300">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null; // リダイレクト中
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
      {/* Admin Header */}
      <header className="bg-gray-900 shadow-lg border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/admin">
              <h1 className="text-2xl font-black text-red-500 cursor-pointer hover:text-red-400 transition tracking-wider">
                🔧 CHEERAIN ADMIN
              </h1>
            </Link>

            <nav className="flex items-center gap-4">
              <Link
                href="/admin"
                className="px-4 py-2 text-yellow-300 hover:text-yellow-200 transition font-bold tracking-wide"
              >
                ダッシュボード
              </Link>
              <Link
                href="/admin/users"
                className="px-4 py-2 text-yellow-300 hover:text-yellow-200 transition font-bold tracking-wide"
              >
                ユーザー管理
              </Link>
              <Link
                href="/admin/nfts"
                className="px-4 py-2 text-yellow-300 hover:text-yellow-200 transition font-bold tracking-wide"
              >
                NFT管理
              </Link>
              <Link
                href="/admin/analytics"
                className="px-4 py-2 text-yellow-300 hover:text-yellow-200 transition font-bold tracking-wide"
              >
                分析
              </Link>
              <Link
                href="/blockchain-mint/nfts"
                className="px-4 py-2 bg-gray-700 text-yellow-300 hover:bg-gray-600 transition font-bold tracking-wide"
              >
                ユーザー画面へ
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Admin Footer */}
      <footer className="bg-gray-900 mt-24 py-8 border-t-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-yellow-300">
          <p className="font-bold">🔧 CHEERAIN Admin Panel - Team hera-16</p>
        </div>
      </footer>
    </div>
  );
}
