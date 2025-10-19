import Link from "next/link";

export default function Home() {
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
              className="px-6 py-2 bg-yellow-400 text-red-900 hover:bg-yellow-300 transition font-bold tracking-wide shadow-md"
            >
              ログイン
            </Link>
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">
            ファンの声を選手に届ける<br />
            <span className="text-red-700">新しい応援のカタチ</span>
          </h2>
          <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto font-medium">
            ギラヴァンツ北九州の選手に応援メッセージを送ると、<br />
            それがNFTカードとして永久保存される革新的な応援アプリです。
          </p>
          <Link
            href="/login"
            className="inline-block px-10 py-4 bg-red-700 text-yellow-300 hover:bg-red-800 transition font-black text-lg shadow-xl border-4 border-yellow-400 tracking-wider"
          >
            今すぐ始める
          </Link>
        </div>

        {/* 機能紹介 */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white shadow-xl p-8 text-center border-4 border-red-700">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-xl font-black text-red-700 mb-3 tracking-wide">応援メッセージ</h3>
            <p className="text-gray-700 font-medium">
              選手への応援コメントを投稿して、モチベーション向上に貢献
            </p>
          </div>
          <div className="bg-white shadow-xl p-8 text-center border-4 border-yellow-400">
            <div className="text-5xl mb-4">🎴</div>
            <h3 className="text-xl font-black text-gray-900 mb-3 tracking-wide">NFTコレクション</h3>
            <p className="text-gray-700 font-medium">
              応援メッセージがNFTとしてブロックチェーン上に永久記録
            </p>
          </div>
          <div className="bg-white shadow-xl p-8 text-center border-4 border-red-700">
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="text-xl font-black text-red-700 mb-3 tracking-wide">限定特典</h3>
            <p className="text-gray-700 font-medium">
              NFT保有者限定でグッズ割引や店舗優待などの特典を提供
            </p>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-red-700 mt-24 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-yellow-200 font-medium">
          <p>© 2025 Cheerain. Built with ❤️ by Team hera-16</p>
        </div>
      </footer>
    </div>
  );
}
