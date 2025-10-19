'use client';

import Link from 'next/link';

export default function NFTsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-red-50 to-yellow-100">
      {/* ヘッダー */}
      <header className="bg-red-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-yellow-300 cursor-pointer hover:text-yellow-200 transition tracking-wider">CHEERAIN</h1>
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
            <Link
              href="/login"
              className="px-4 py-2 bg-yellow-400 text-red-900 hover:bg-yellow-300 transition font-black border-2 border-red-700 tracking-wide"
            >
              ログイン
            </Link>
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="text-6xl mb-6">🎴</div>
          <h2 className="text-4xl font-black text-red-700 mb-4 tracking-wider">NFT一覧</h2>
          <p className="text-xl text-gray-900 mb-8 max-w-2xl mx-auto font-bold">
            このページは準備中です。<br />
            今後、全てのCheerain NFTを閲覧できるようになります。
          </p>
          
          <div className="bg-white shadow-2xl p-8 max-w-2xl mx-auto border-4 border-red-700">
            <h3 className="text-2xl font-black text-red-700 mb-4 tracking-wider">実装予定の機能</h3>
            <ul className="text-left space-y-3 text-gray-900">
              <li className="flex items-start">
                <span className="text-red-700 mr-2 font-black">✓</span>
                <span className="font-bold">選手別のNFT一覧表示</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-700 mr-2 font-black">✓</span>
                <span className="font-bold">最新の応援メッセージNFT</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-700 mr-2 font-black">✓</span>
                <span className="font-bold">人気順・新着順のソート機能</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-700 mr-2 font-black">✓</span>
                <span className="font-bold">NFTの詳細情報とトランザクション履歴</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gray-200 text-gray-900 hover:bg-gray-300 transition font-black border-2 border-gray-400 tracking-wide"
            >
              トップページへ
            </Link>
            <Link
              href="/mypage"
              className="px-6 py-3 bg-red-700 text-yellow-300 hover:bg-red-800 transition font-black border-2 border-yellow-400 tracking-wider"
            >
              マイページへ
            </Link>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-red-700 mt-24 py-8 border-t-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-yellow-200">
          <p className="font-bold">© 2025 CHEERAIN. Built with ❤️ by Team hera-16</p>
        </div>
      </footer>
    </div>
  );
}
