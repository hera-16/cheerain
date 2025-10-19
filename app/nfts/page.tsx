'use client';

import { useState } from 'react';
import Link from 'next/link';
import NFTMintForm from '@/components/NFTMintForm';
import NFTGallery from '@/components/NFTGallery';

type TabType = 'gallery' | 'mint';

export default function NFTsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('gallery');

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

      {/* タブバナー */}
      <div className="bg-white shadow-md border-b-4 border-red-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-8 py-4 font-black tracking-wider transition-all ${
                activeTab === 'gallery'
                  ? 'bg-red-700 text-yellow-300 border-b-4 border-yellow-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🎴 NFT一覧
            </button>
            <button
              onClick={() => setActiveTab('mint')}
              className={`px-8 py-4 font-black tracking-wider transition-all ${
                activeTab === 'mint'
                  ? 'bg-red-700 text-yellow-300 border-b-4 border-yellow-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              💬 NFT発行
            </button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="py-8">
        {activeTab === 'gallery' ? <NFTGallery /> : <NFTMintForm />}
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
