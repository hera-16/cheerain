import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-red-50 to-yellow-100">
      {/* ヘッダー - 簡易版（このページ専用） */}
      <header className="bg-red-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-xl sm:text-2xl font-bold text-yellow-300 cursor-pointer hover:text-yellow-200 transition tracking-wider">CHEERAIN</h1>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/nfts"
              className="px-2 sm:px-4 py-2 text-yellow-100 hover:text-yellow-300 transition font-bold tracking-wide text-xs sm:text-base"
            >
              NFT一覧
            </Link>
            <Link
              href="/mypage"
              className="px-2 sm:px-4 py-2 text-yellow-100 hover:text-yellow-300 transition font-bold tracking-wide text-xs sm:text-base"
            >
              マイページ
            </Link>
            <Link
              href="/login"
              className="px-3 sm:px-6 py-2 bg-yellow-400 text-red-900 hover:bg-yellow-300 transition font-bold tracking-wide shadow-md text-xs sm:text-base"
            >
              ログイン
            </Link>
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6 tracking-tight px-2">
            ファンの声を選手に届ける<br className="hidden sm:block" />
            <span className="text-red-700">新しい応援のカタチ</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-800 mb-6 sm:mb-8 max-w-2xl mx-auto font-medium px-4">
            ギラヴァンツ北九州の選手に応援メッセージを送ると、<br className="hidden sm:block" />
            それがNFTカードとして永久保存される革新的な応援アプリです。
          </p>
          <Link
            href="/login"
            className="inline-block px-6 sm:px-10 py-3 sm:py-4 bg-red-700 text-yellow-300 hover:bg-red-800 transition font-black text-base sm:text-lg shadow-xl border-2 sm:border-4 border-yellow-400 tracking-wider"
          >
            今すぐ始める
          </Link>
        </div>

        {/* 機能紹介 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
          <div className="bg-white shadow-xl p-6 sm:p-8 text-center border-4 border-red-700">
            <div className="text-4xl sm:text-5xl mb-4">💬</div>
            <h3 className="text-lg sm:text-xl font-black text-red-700 mb-3 tracking-wide">応援メッセージ</h3>
            <p className="text-sm sm:text-base text-gray-700 font-medium">
              選手への応援コメントを投稿して、モチベーション向上に貢献
            </p>
          </div>
          <div className="bg-white shadow-xl p-6 sm:p-8 text-center border-4 border-yellow-400">
            <div className="text-4xl sm:text-5xl mb-4">🎴</div>
            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 tracking-wide">NFTコレクション</h3>
            <p className="text-sm sm:text-base text-gray-700 font-medium">
              応援メッセージがNFTとしてブロックチェーン上に永久記録
            </p>
          </div>
          <div className="bg-white shadow-xl p-6 sm:p-8 text-center border-4 border-red-700 sm:col-span-2 lg:col-span-1">
            <div className="text-4xl sm:text-5xl mb-4">🎁</div>
            <h3 className="text-lg sm:text-xl font-black text-red-700 mb-3 tracking-wide">限定特典</h3>
            <p className="text-sm sm:text-base text-gray-700 font-medium">
              NFT保有者限定でグッズ割引や店舗優待などの特典を提供
            </p>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-red-700 mt-12 sm:mt-24 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-yellow-300 font-medium">
          <p className="text-sm sm:text-base">© 2025 Cheerain. Built with ❤️ by Team hera-16</p>
        </div>
      </footer>
    </div>
  );
}
