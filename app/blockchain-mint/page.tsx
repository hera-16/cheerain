import BlockchainNFTMintForm from '@/components/BlockchainNFTMintForm';
import Link from 'next/link';

export default function BlockchainMintPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      {/* ヘッダー */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-block text-blue-600 hover:text-blue-700 mb-4"
        >
          ← ホームに戻る
        </Link>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ブロックチェーンNFT発行
          </h1>
          <p className="text-gray-600">
            Polygon Amoy Testnet上に応援NFTを発行します
          </p>
        </div>
      </div>

      {/* NFT発行フォーム */}
      <BlockchainNFTMintForm />

      {/* 説明セクション */}
      <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          ブロックチェーンNFTとは？
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            このページでは、あなたの応援メッセージを<strong>Polygon Amoy Testnet</strong>上の
            NFT（Non-Fungible Token）として発行します。
          </p>
          <div>
            <h3 className="font-semibold mb-2">特徴:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>ブロックチェーン上に永久保存</li>
              <li>改ざん不可能</li>
              <li>所有権が証明可能</li>
              <li>OpenSeaなどで閲覧可能</li>
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

      {/* セットアップガイドリンク */}
      <div className="max-w-2xl mx-auto mt-6 text-center">
        <Link
          href="/docs/BLOCKCHAIN_SETUP.md"
          className="text-blue-600 hover:text-blue-700 underline"
        >
          📖 セットアップガイドを見る
        </Link>
      </div>
    </div>
  );
}
