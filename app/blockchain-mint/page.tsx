'use client';

import { useState } from 'react';
import BlockchainNFTMintForm from '@/components/BlockchainNFTMintForm';
import BlockchainNFTGallery from '@/components/BlockchainNFTGallery';
import Header from '@/components/Header';

type TabType = 'gallery' | 'mint';

export default function BlockchainMintPage() {
  const [activeTab, setActiveTab] = useState<TabType>('gallery');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />

      {/* タブバナー */}
      <div className="bg-white shadow-md border-b-4 border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-8 py-4 font-black tracking-wider transition-all ${
                activeTab === 'gallery'
                  ? 'bg-blue-700 text-yellow-300 border-b-4 border-yellow-400'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              🎴 ブロックチェーンNFT一覧
            </button>
            <button
              onClick={() => setActiveTab('mint')}
              className={`px-8 py-4 font-black tracking-wider transition-all ${
                activeTab === 'mint'
                  ? 'bg-blue-700 text-yellow-300 border-b-4 border-yellow-400'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
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
        <div className="max-w-4xl mx-auto mt-8 mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            ブロックチェーンNFTとは？
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              このページでは、<strong>Polygon Amoy Testnet</strong>上に発行された
              本物のブロックチェーンNFTを表示しています。
            </p>
            <div>
              <h3 className="font-semibold mb-2">特徴:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>ブロックチェーン上に永久保存</li>
                <li>改ざん不可能</li>
                <li>所有権が証明可能</li>
                <li>ウォレットで管理可能</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>注意:</strong> 現在はテストネット（Polygon Amoy）を使用しています。
                実際の価値はありませんが、本番環境と同じ仕組みで動作します。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* フッター */}
      <footer className="bg-blue-700 mt-24 py-8 border-t-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-yellow-300">
          <p className="font-bold">© 2025 CHEERAIN. Built with ❤️ by Team hera-16</p>
        </div>
      </footer>
    </div>
  );
}
