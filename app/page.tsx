'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-wider">⚽ CHEERAIN</h1>
            <p className="text-sm text-red-100 mt-1">ギラヴァンツ北九州 応援アプリ</p>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/blockchain-mint" className="text-white hover:text-red-100 transition font-semibold">
              ブロックチェーンNFT
            </Link>
            <Link href="/matches" className="text-white hover:text-red-100 transition font-semibold">
              試合結果
            </Link>
            <Link href="/mypage" className="text-white hover:text-red-100 transition font-semibold">
              マイページ
            </Link>
          </nav>
          <div className="flex gap-4 items-center">
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="メニュー"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            {isLoggedIn ? (
              <button
                onClick={() => router.push('/mypage')}
                className="hidden md:block px-6 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition"
              >
                マイページ
              </button>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="hidden md:block px-6 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition"
              >
                ログイン
              </button>
            )}
          </div>
        </div>
        {/* モバイルメニュー */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-red-600 px-4 py-4">
            <div className="flex flex-col gap-4">
              <Link href="/blockchain-mint" className="text-white hover:text-red-100 transition font-semibold">
                ブロックチェーンNFT
              </Link>
              <Link href="/matches" className="text-white hover:text-red-100 transition font-semibold">
                試合結果
              </Link>
              <Link href="/mypage" className="text-white hover:text-red-100 transition font-semibold">
                マイページ
              </Link>
              {!isLoggedIn && (
                <Link href="/login" className="text-white hover:text-red-100 transition font-semibold">
                  ログイン
                </Link>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* ヒーローセクション */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-gray-900 mb-4">
            ギラヴァンツ北九州を<br />もっと身近に
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            試合結果の確認、応援NFTの発行、現地応援の記録など<br />
            すべてをこのアプリで
          </p>
        </div>

        {/* 機能カード */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* 試合結果・戦績 */}
          <Link href="/matches" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition">
                試合結果・戦績
              </h3>
              <p className="text-gray-600 mb-4">
                最新の試合結果や過去の戦績を確認できます。勝敗統計も一目でわかります。
              </p>
              <div className="text-red-600 font-semibold flex items-center">
                詳しく見る
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="mt-4 inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                🌐 ログイン不要
              </div>
            </div>
          </Link>

          {/* NFT発行 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all">
            <div className="text-5xl mb-4">🎫</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              応援NFT
            </h3>
            <p className="text-gray-600 mb-4">
              試合ごとにNFTを発行。あなたの応援の証を記録し、特典をゲット。
            </p>
            <div className="mt-4 inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              🔐 ログイン必要
            </div>
          </div>

          {/* 現地応援記録 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all">
            <div className="text-5xl mb-4">📍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              現地応援記録
            </h3>
            <p className="text-gray-600 mb-4">
              スタジアムで応援した記録を残せます。限定特典がもらえることも。
            </p>
            <div className="mt-4 inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              🔐 ログイン必要
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
