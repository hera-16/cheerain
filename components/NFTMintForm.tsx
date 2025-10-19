'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NFTFormData } from '@/types/nft';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

export default function NFTMintForm() {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState<NFTFormData>({
    title: '',
    message: '',
    playerName: '',
    image: null,
  });
  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('NFTを発行するにはログインが必要です');
      return;
    }

    setIsLoading(true);

    try {
      // Firestoreに応援メッセージNFTデータを保存
      await addDoc(collection(db, 'nfts'), {
        title: formData.title,
        message: formData.message,
        playerName: formData.playerName,
        imageUrl: preview || '',
        creatorAddress: user.email,
        creatorUid: user.uid,
        createdAt: serverTimestamp(),
      });

      alert('NFTを発行しました！');

      // フォームをリセット
      setFormData({
        title: '',
        message: '',
        playerName: '',
        image: null,
      });
      setPreview('');
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('NFTの発行に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // ローディング中
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <p className="text-xl font-black text-red-700">読み込み中...</p>
      </div>
    );
  }

  // 未ログイン時
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-4xl font-black text-red-700 mb-4 tracking-wider">ログインが必要です</h2>
          <p className="text-gray-800 font-bold mb-8">
            NFTを発行するには、ログインまたはアカウント作成が必要です
          </p>
        </div>

        <div className="bg-white shadow-2xl p-8 border-4 border-red-700 text-center">
          <p className="text-gray-700 font-bold mb-6">
            ログインすると、選手への応援メッセージをNFTとして永久保存できます
          </p>
          <Link
            href="/login"
            className="inline-block bg-red-700 hover:bg-red-800 text-yellow-300 font-black py-4 px-8 transition-colors border-4 border-yellow-400 tracking-wider text-lg"
          >
            ログイン / アカウント作成
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">💬</div>
        <h2 className="text-4xl font-black text-red-700 mb-4 tracking-wider">応援NFTを発行する</h2>
        <p className="text-gray-800 font-bold">
          選手への応援メッセージをNFTとして永久保存しよう！
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-2xl p-8 border-4 border-red-700">
        <div>
          <label htmlFor="playerName" className="block text-sm font-black mb-2 text-red-700">
            応援する選手名 *
          </label>
          <input
            type="text"
            id="playerName"
            value={formData.playerName}
            onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-700 focus:outline-none font-bold"
            placeholder="例: 山田太郎"
            required
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-black mb-2 text-red-700">
            タイトル *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-700 focus:outline-none font-bold"
            placeholder="例: 次の試合も頑張って！"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-black mb-2 text-red-700">
            応援メッセージ *
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={5}
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-700 focus:outline-none font-bold"
            placeholder="選手への応援メッセージを書いてください..."
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-black mb-2 text-red-700">
            画像（オプション）
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-700 focus:outline-none"
          />
          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-auto border-4 border-yellow-400"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-700 hover:bg-red-800 text-yellow-300 font-black py-4 px-6 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed border-4 border-yellow-400 tracking-wider text-lg"
        >
          {isLoading ? '発行中...' : '🎴 NFTを発行する'}
        </button>
      </form>
    </div>
  );
}
