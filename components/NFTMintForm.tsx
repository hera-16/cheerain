'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NFTFormData } from '@/types/nft';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { defaultImages, generateDefaultImageDataURL } from '@/lib/defaultImages';

type PaymentMethod = 'credit' | 'paypay' | 'aupay';

export default function NFTMintForm() {
  const { user, userData, loading } = useAuth();
  const [formData, setFormData] = useState<NFTFormData>({
    title: '',
    message: '',
    playerName: '',
    image: null,
  });
  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [venueId, setVenueId] = useState<string>('');
  const [selectedDefaultImage, setSelectedDefaultImage] = useState<number | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setSelectedDefaultImage(null); // カスタム画像選択時はデフォルト画像をクリア
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDefaultImageSelect = (imageId: number) => {
    setSelectedDefaultImage(imageId);
    const dataURL = generateDefaultImageDataURL(imageId);
    setPreview(dataURL);
    setFormData({ ...formData, image: null }); // カスタム画像をクリア
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('NFTを発行するにはログインが必要です');
      return;
    }

    if (!paymentAmount || parseFloat(paymentAmount) < 500) {
      alert('支払金額は500円以上を入力してください');
      return;
    }

    // 会場IDのバリデーション（入力されている場合のみ）
    if (venueId && !/^\d{5}$/.test(venueId)) {
      alert('会場IDは5桁の数字で入力してください');
      return;
    }

    setIsLoading(true);

    try {
      // 画像の取得: デフォルト画像または自前の画像
      let imageBase64 = '';

      if (selectedDefaultImage !== null) {
        // デフォルト画像が選択されている場合
        imageBase64 = generateDefaultImageDataURL(selectedDefaultImage);
      } else if (preview) {
        // 自前の画像がアップロードされている場合
        imageBase64 = preview;
      }

      // Firestoreに応援メッセージNFTデータを保存
      await addDoc(collection(db, 'nfts'), {
        title: formData.title,
        message: formData.message,
        playerName: formData.playerName,
        imageUrl: imageBase64, // Base64エンコードされた画像データ（デフォルトまたは自前）
        creatorAddress: user.email,
        creatorUid: user.uid,
        creatorUserId: userData?.userId || '',
        paymentAmount: parseFloat(paymentAmount),
        paymentMethod: paymentMethod,
        venueId: venueId || null, // 会場ID（任意）
        isVenueAttendee: venueId ? true : false, // 現地参加フラグ
        createdAt: serverTimestamp(),
      });

      const attendeeStatus = venueId ? '\n🏟️ 現地参加サポーター認定！' : '';
      alert(`NFTを発行しました！\n支払金額: ¥${paymentAmount}\n支払方法: ${paymentMethod === 'credit' ? 'クレジットカード' : paymentMethod === 'paypay' ? 'PayPay' : 'auPay'}${attendeeStatus}`);

      // フォームをリセット
      setFormData({
        title: '',
        message: '',
        playerName: '',
        image: null,
      });
      setPreview('');
      setPaymentAmount('');
      setPaymentMethod('credit');
      setVenueId('');
      setSelectedDefaultImage(null);
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
          <label htmlFor="userId" className="block text-sm font-black mb-2 text-red-700">
            ユーザーID
          </label>
          <input
            type="text"
            id="userId"
            value={userData?.userId || ''}
            disabled
            className="w-full px-4 py-3 border-2 border-gray-300 bg-gray-100 font-bold text-gray-700 cursor-not-allowed"
            placeholder="ユーザーID"
          />
          <p className="text-xs text-gray-700 mt-1 font-medium">このIDでNFTが発行されます</p>
        </div>

        <div>
          <label htmlFor="playerName" className="block text-sm font-black mb-2 text-red-700">
            応援する選手名 *
          </label>
          <input
            type="text"
            id="playerName"
            value={formData.playerName}
            onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-700 focus:outline-none font-bold text-gray-900"
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
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-700 focus:outline-none font-bold text-gray-900"
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
            className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-700 focus:outline-none font-bold text-gray-900"
            placeholder="選手への応援メッセージを書いてください..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-black mb-2 text-red-700">
            画像（オプション）
          </label>

          {/* デフォルト画像選択 */}
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-700 mb-2">⚽ デフォルト画像から選択:</p>
            <div className="grid grid-cols-5 gap-2">
              {defaultImages.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => handleDefaultImageSelect(img.id)}
                  className={`aspect-square border-4 transition-all hover:scale-105 ${
                    selectedDefaultImage === img.id
                      ? 'border-red-700 shadow-lg'
                      : 'border-gray-300 hover:border-yellow-400'
                  }`}
                  title={img.name}
                >
                  <img
                    src={generateDefaultImageDataURL(img.id)}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* カスタム画像アップロード */}
          <div>
            <p className="text-xs font-bold text-gray-700 mb-2">📁 または独自の画像をアップロード:</p>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-700 focus:outline-none"
            />
          </div>

          {/* プレビュー */}
          {preview && (
            <div className="mt-4">
              <p className="text-xs font-bold text-gray-700 mb-2">プレビュー:</p>
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-auto border-4 border-yellow-400"
              />
            </div>
          )}
        </div>

        {/* 会場IDセクション */}
        <div className="border-t-4 border-yellow-400 pt-6 mt-6">
          <h3 className="text-xl font-black text-red-700 mb-4 tracking-wider">🏟️ 会場ID（オプション）</h3>

          <div className="bg-yellow-50 border-2 border-yellow-400 p-4 mb-4">
            <p className="text-sm font-bold text-gray-900 mb-2">
              📍 現地参加サポーター特典
            </p>
            <p className="text-xs text-gray-700 font-medium">
              試合会場で掲示されている5桁の会場IDを入力すると、現地参加サポーターとして認定されます！
            </p>
          </div>

          <div>
            <label htmlFor="venueId" className="block text-sm font-black mb-2 text-red-700">
              会場ID（5桁）
            </label>
            <input
              type="text"
              id="venueId"
              value={venueId}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                setVenueId(value);
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 focus:border-red-700 focus:outline-none font-bold text-lg tracking-widest text-center text-gray-900"
              placeholder="12345"
              maxLength={5}
            />
            <p className="text-xs text-gray-700 mt-1 font-medium">
              ※ 会場にいない場合は空欄のまま発行できます
            </p>
          </div>
        </div>

        {/* 支払い情報セクション */}
        <div className="border-t-4 border-yellow-400 pt-6 mt-6">
          <h3 className="text-xl font-black text-red-700 mb-4 tracking-wider">💰 支払い情報</h3>

          <div className="mb-6">
            <label htmlFor="paymentAmount" className="block text-sm font-black mb-2 text-red-700">
              支払金額 *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 font-black text-lg">¥</span>
              <input
                type="number"
                id="paymentAmount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 focus:border-red-700 focus:outline-none font-bold text-lg text-gray-900"
                placeholder="1000"
                min="500"
                step="100"
                required
              />
            </div>
            <p className="text-xs text-gray-700 mt-1 font-medium">最低金額: 500円</p>
          </div>

          <div>
            <label className="block text-sm font-black mb-3 text-red-700">
              支払方法 *
            </label>
            <div className="grid grid-cols-3 gap-4">
              {/* クレジットカード */}
              <button
                type="button"
                onClick={() => setPaymentMethod('credit')}
                className={`p-4 border-4 transition-all ${
                  paymentMethod === 'credit'
                    ? 'border-red-700 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-red-300'
                }`}
              >
                <div className="text-4xl mb-2">💳</div>
                <p className="text-xs font-black text-gray-900">クレジット<br/>カード</p>
              </button>

              {/* PayPay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('paypay')}
                className={`p-4 border-4 transition-all ${
                  paymentMethod === 'paypay'
                    ? 'border-red-700 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-red-300'
                }`}
              >
                <div className="text-4xl mb-2">📱</div>
                <p className="text-xs font-black text-red-600">PayPay</p>
              </button>

              {/* auPay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('aupay')}
                className={`p-4 border-4 transition-all ${
                  paymentMethod === 'aupay'
                    ? 'border-red-700 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-red-300'
                }`}
              >
                <div className="text-4xl mb-2">📲</div>
                <p className="text-xs font-black text-orange-600">auPay</p>
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-700 hover:bg-red-800 text-yellow-300 font-black py-4 px-6 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed border-4 border-yellow-400 tracking-wider text-lg"
        >
          {isLoading ? '発行中...' : `🎴 ¥${paymentAmount || '0'}で NFTを発行する`}
        </button>
      </form>
    </div>
  );
}
