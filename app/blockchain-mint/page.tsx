'use client';

import { useState } from 'react';
import BlockchainNFTMintForm from '@/components/BlockchainNFTMintForm';
import BlockchainNFTGallery from '@/components/BlockchainNFTGallery';
import Header from '@/components/Header';

type TabType = 'gallery' | 'mint';

export default function BlockchainMintPage() {
  const [activeTab, setActiveTab] = useState<TabType>('gallery');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-yellow-100 to-blue-100">
      <Header />

      {/* タブバナー */}
      <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 shadow-2xl border-b-8 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-10 py-5 font-black tracking-wider transition-all transform text-xl border-4 rounded-t-2xl ${
                activeTab === 'gallery'
                  ? 'bg-yellow-400 text-gray-900 border-red-600 scale-110 shadow-2xl -mb-2'
                  : 'bg-white text-gray-900 border-blue-500 hover:bg-blue-100 hover:scale-105'
              }`}
            >
              🎴 NFT一覧
            </button>
            <button
              onClick={() => setActiveTab('mint')}
              className={`px-10 py-5 font-black tracking-wider transition-all transform text-xl border-4 rounded-t-2xl ${
                activeTab === 'mint'
                  ? 'bg-yellow-400 text-gray-900 border-red-600 scale-110 shadow-2xl -mb-2'
                  : 'bg-white text-gray-900 border-blue-500 hover:bg-blue-100 hover:scale-105'
              }`}
            >
              💬 NFT発行
            </button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="py-8">
        {activeTab === 'gallery' ? <BlockchainNFTGallery /> : <BlockchainNFTMintForm />}
      </main>

      {/* 説明セクション */}
      {activeTab === 'gallery' && (
        <div className="max-w-4xl mx-auto mt-8 mb-8 bg-gradient-to-br from-yellow-50 via-red-50 to-blue-50 rounded-2xl shadow-2xl p-8 border-4 border-red-500">
          <h2 className="text-3xl font-black text-center mb-6 text-gray-900">
            ⚡ ブロックチェーンNFTとは？ ⚡
          </h2>
          <div className="space-y-6 text-gray-900">
            <p className="text-lg font-bold">
              このページでは、<span className="text-red-600">Polygon Amoy Testnet</span>上に発行された
              本物のブロックチェーンNFTを表示しています。
            </p>
            <div className="bg-white p-6 rounded-xl border-4 border-blue-400 shadow-lg">
              <h3 className="font-black text-xl text-gray-900 mb-4">🌟 特徴:</h3>
              <ul className="list-none space-y-3 ml-0">
                <li className="flex items-center gap-3 text-lg font-bold text-gray-900">
                  <span className="text-2xl">🔒</span>
                  <span>ブロックチェーン上に永久保存</span>
                </li>
                <li className="flex items-center gap-3 text-lg font-bold text-gray-900">
                  <span className="text-2xl">🛡️</span>
                  <span>改ざん不可能</span>
                </li>
                <li className="flex items-center gap-3 text-lg font-bold text-gray-900">
                  <span className="text-2xl">✅</span>
                  <span>所有権が証明可能</span>
                </li>
                <li className="flex items-center gap-3 text-lg font-bold text-gray-900">
                  <span className="text-2xl">👛</span>
                  <span>ウォレットで管理可能</span>
                </li>
              </ul>
            </div>
            <div className="p-6 bg-gradient-to-r from-yellow-300 to-red-300 border-4 border-red-600 rounded-xl shadow-lg">
              <p className="text-gray-900 font-bold text-lg flex items-center gap-2">
                <span className="text-3xl">⚠️</span>
                <span><strong>注意:</strong> 現在はテストネット（Polygon Amoy）を使用しています。
                実際の価値はありませんが、本番環境と同じ仕組みで動作します。</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* フッター */}
      <footer className="bg-gradient-to-r from-red-600 via-yellow-500 to-blue-600 mt-24 py-10 border-t-8 border-yellow-400 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-black text-2xl text-white drop-shadow-lg">
            © 2025 CHEERAIN. Built with ❤️ by Team hera-16
          </p>
        </div>
      </footer>
    </div>
  );
}
