'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NFTMintForm from '@/components/NFTMintForm';
import NFTGallery from '@/components/NFTGallery';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

type TabType = 'gallery' | 'mint';

export default function NFTsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('gallery');
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleMintTabClick = () => {
    if (loading) {
      // ローディング中は何もしない
      return;
    }

    if (!user) {
      // 未ログインの場合はログインページへリダイレクト
      router.push('/login');
      return;
    }

    // ログイン済みの場合はタブを切り替え
    setActiveTab('mint');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-red-50 to-yellow-100">
      <Header />

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
              onClick={handleMintTabClick}
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
