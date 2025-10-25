'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NFTFormData } from '@/types/nft';
import { useAuth } from '@/contexts/AuthContext';
import { defaultImages, generateDefaultImageDataURL } from '@/lib/defaultImages';
import { Player } from '@/types/player';
import { api } from '@/lib/api';

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
  const [players, setPlayers] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [venueVerified, setVenueVerified] = useState<{ ok: boolean; venueName?: string | null } | null>(null);

  // 選手データを取得（REST APIから）
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await api.get<Player[]>('/players');
        if (response.success && response.data) {
          // アクティブな選手のみフィルタして番号順にソート
          const activePlayers = response.data
            .filter(p => p.isActive)
            .sort((a, b) => a.number - b.number);
          setPlayers(activePlayers);
        }
      } catch (error) {
        console.error('選手データの取得エラー:', error);
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, []);

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
      let imageUrl = '';

      if (selectedDefaultImage !== null) {
        // デフォルト画像が選択されている場合（Base64のまま保存）
        imageUrl = generateDefaultImageDataURL(selectedDefaultImage);
      } else if (formData.image) {
        // 自前の画像がアップロードされている場合 → Java APIにアップロード
        const formDataObj = new FormData();
        formDataObj.append('file', formData.image);
        formDataObj.append('type', 'nft');

        const uploadResponse = await api.uploadFile('/upload/image', formDataObj);
        if (uploadResponse.success && uploadResponse.data) {
          imageUrl = uploadResponse.data.url;
        } else {
          throw new Error('画像のアップロードに失敗しました');
        }
      }

      // REST APIを使用してNFTを発行
      const response = await api.post('/nfts', {
        title: formData.title,
        message: formData.message,
        playerName: formData.playerName,
        imageUrl: imageUrl, // Storage URLまたはBase64（デフォルト画像の場合）
        paymentAmount: parseFloat(paymentAmount),
        paymentMethod: paymentMethod.toUpperCase(), // バックエンドは大文字を要求（CREDIT、PAYPAY、AUPAY）
        venueId: venueId || '', // 会場ID（空文字列または5桁の数字）
      });

      if (response.success) {
        const attendeeStatus = venueId ? '\n🏟️ 現地参加サポーター認定！' : '';
        alert(`NFTを発行しました！\n支払金額: ¥${paymentAmount}\n支払方法: ${paymentMethod === 'credit' ? 'クレジットカード' : paymentMethod === 'paypay' ? 'PayPay' : 'auPay'}${attendeeStatus}`);
      }

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
        <div className="text-6xl mb-4">🎴</div>
        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-blue-600 mb-4 tracking-wider">応援NFTを発行する</h2>
        <p className="text-xl font-black text-gray-900">
          選手への応援メッセージをNFTとして永久保存しよう！
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50 shadow-2xl p-8 border-4 border-red-600 rounded-lg">
        <div className="bg-white/80 p-4 rounded-lg border-2 border-blue-400">
          <label htmlFor="userId" className="block text-sm font-black mb-2 text-blue-700">
            👤 ユーザーID
          </label>
          <input
            type="text"
            id="userId"
            value={userData?.userId || ''}
            disabled
            className="w-full px-4 py-3 border-3 border-blue-300 bg-blue-50 font-bold text-gray-700 cursor-not-allowed rounded-lg"
            placeholder="ユーザーID"
          />
          <p className="text-xs text-blue-700 mt-1 font-bold">このIDでNFTが発行されます</p>
        </div>

        <div className="bg-white/80 p-4 rounded-lg border-2 border-red-400">
          <label htmlFor="playerName" className="block text-sm font-black mb-2 text-red-700">
            ⚽ 応援する選手 *
          </label>
          {loadingPlayers ? (
            <div className="w-full px-4 py-3 border-3 border-red-300 bg-red-50 font-bold text-gray-500 text-center rounded-lg">
              選手データを読み込み中...
            </div>
          ) : (
            <select
              id="playerName"
              value={formData.playerName}
              onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
              className="w-full px-4 py-3 border-3 border-red-300 focus:border-red-600 focus:outline-none font-bold text-gray-900 rounded-lg bg-white"
              required
            >
              <option value="">選手を選択してください</option>
              <option value="チームを応援" className="font-black text-red-700">⚽ チームを応援</option>
              <optgroup label="🥅 ゴールキーパー (GK)">
                {players.filter(p => p.position === 'GK').map(player => (
                  <option key={player.id} value={player.name}>
                    {player.number}. {player.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🛡️ ディフェンダー (DF)">
                {players.filter(p => p.position === 'DF').map(player => (
                  <option key={player.id} value={player.name}>
                    {player.number}. {player.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="⚡ ミッドフィルダー (MF)">
                {players.filter(p => p.position === 'MF').map(player => (
                  <option key={player.id} value={player.name}>
                    {player.number}. {player.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="⚔️ フォワード (FW)">
                {players.filter(p => p.position === 'FW').map(player => (
                  <option key={player.id} value={player.name}>
                    {player.number}. {player.name}
                  </option>
                ))}
              </optgroup>
            </select>
          )}
          <p className="text-xs text-red-700 mt-1 font-bold bg-red-50 p-2 rounded">
            💡 一番上の「チームを応援」を選択すると、チーム全体への応援になります
          </p>
        </div>

        <div className="bg-white/80 p-4 rounded-lg border-2 border-yellow-400">
          <label htmlFor="title" className="block text-sm font-black mb-2 text-yellow-700">
            ✨ タイトル *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border-3 border-yellow-300 focus:border-yellow-600 focus:outline-none font-bold text-gray-900 rounded-lg bg-white"
            placeholder="例: 次の試合も頑張って！"
            required
          />
        </div>

        <div className="bg-white/80 p-4 rounded-lg border-2 border-blue-400">
          <label htmlFor="message" className="block text-sm font-black mb-2 text-blue-700">
            💬 応援メッセージ *
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={5}
            className="w-full px-4 py-3 border-3 border-blue-300 focus:border-blue-600 focus:outline-none font-bold text-gray-900 rounded-lg bg-white"
            placeholder="選手への応援メッセージを書いてください..."
            required
          />
        </div>

        <div className="bg-white/80 p-4 rounded-lg border-2 border-red-400">
          <label className="block text-sm font-black mb-2 text-red-700">
            🎨 画像（オプション）
          </label>

          {/* デフォルト画像選択 */}
          <div className="mb-4 bg-gradient-to-r from-yellow-50 to-red-50 p-3 rounded-lg">
            <p className="text-xs font-black text-red-700 mb-2">⚽ デフォルト画像から選択:</p>
            <div className="grid grid-cols-5 gap-2">
              {defaultImages.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => handleDefaultImageSelect(img.id)}
                  className={`aspect-square border-4 rounded-lg transition-all hover:scale-105 ${
                    selectedDefaultImage === img.id
                      ? 'border-red-600 shadow-xl ring-4 ring-yellow-300'
                      : 'border-gray-300 hover:border-yellow-500'
                  }`}
                  title={img.name}
                >
                  <img
                    src={generateDefaultImageDataURL(img.id)}
                    alt={img.name}
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* カスタム画像アップロード */}
          <div className="bg-gradient-to-r from-blue-50 to-yellow-50 p-3 rounded-lg">
            <p className="text-xs font-black text-blue-700 mb-2">📁 または独自の画像をアップロード:</p>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 border-3 border-blue-300 focus:border-blue-600 focus:outline-none rounded-lg bg-white font-medium"
            />
          </div>

          {/* プレビュー */}
          {preview && (
            <div className="mt-4 bg-gradient-to-br from-yellow-50 to-red-50 p-3 rounded-lg">
              <p className="text-xs font-black text-yellow-700 mb-2">✨ プレビュー:</p>
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-auto border-4 border-yellow-500 rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>

        {/* 会場IDセクション */}
        <div className="bg-gradient-to-r from-red-100 via-yellow-100 to-blue-100 p-6 rounded-lg border-4 border-gradient-to-r from-red-400 via-yellow-400 to-blue-400">
          <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-600 mb-4 tracking-wider">🏟️ 会場ID（オプション）</h3>

          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-3 border-yellow-500 p-4 mb-4 rounded-lg shadow-md">
            <p className="text-sm font-black text-red-700 mb-2">
              📍 現地参加サポーター特典
            </p>
            <p className="text-xs text-gray-900 font-bold">
              試合会場で掲示されている5桁の会場IDを入力すると、現地参加サポーターとして認定されます！
            </p>
          </div>

          <div className="bg-white/80 p-4 rounded-lg">
            <label htmlFor="venueId" className="block text-sm font-black mb-2 text-blue-700">
              🎫 会場ID（5桁）
            </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="venueId"
                  value={venueId}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                    setVenueId(value);
                  }}
                  className="w-full px-4 py-3 border-3 border-blue-400 focus:border-blue-600 focus:outline-none font-black text-xl tracking-widest text-center text-gray-900 rounded-lg bg-blue-50"
                  placeholder="12345"
                  maxLength={5}
                />
                <div className="w-48">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="w-full px-3 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 font-black text-red-800 border-3 border-red-600 rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition-all"
                      onClick={async () => {
                        if (!venueId || venueId.length === 0) {
                          alert('会場IDを入力してください（5桁）');
                          return;
                        }
                        setIsVerifying(true);
                        setVenueVerified(null);
                        try {
                          const response = await api.post<{ match: boolean; venueName?: string }>('/venues/verify', { code: venueId });
                          if (response.success && response.data) {
                            if (response.data.match) {
                              setVenueVerified({ ok: true, venueName: response.data.venueName || null });
                              alert('コードが一致しました — 現地参加が認証されました');
                            } else {
                              setVenueVerified({ ok: false });
                              alert('コードが一致しません');
                            }
                          } else {
                            setVenueVerified({ ok: false });
                            alert('コードが一致しません');
                          }
                        } catch (err) {
                          console.error('照合エラー', err);
                          alert('照合に失敗しました');
                        } finally {
                          setIsVerifying(false);
                        }
                      }}
                    >
                      {isVerifying ? '照合中...' : '照合'}
                    </button>
                  </div>
                  {venueVerified && (
                    <div className={`mt-2 text-sm ${venueVerified.ok ? 'text-green-700' : 'text-red-700'}`}>
                      {venueVerified.ok ? `照合済み: ${venueVerified.venueName || '会場名なし'}` : '不一致です'}
                    </div>
                  )}
                </div>
              </div>
            <p className="text-xs text-blue-700 mt-1 font-bold bg-blue-50 p-2 rounded">
              💡 会場にいない場合は空欄のまま発行できます
            </p>
          </div>
        </div>

        {/* 支払い情報セクション */}
        <div className="bg-gradient-to-br from-yellow-100 via-red-100 to-blue-100 p-6 rounded-lg border-4 border-red-500">
          <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-red-600 mb-4 tracking-wider">💰 支払い情報</h3>

          <div className="mb-6 bg-white/80 p-4 rounded-lg">
            <label htmlFor="paymentAmount" className="block text-sm font-black mb-2 text-red-700">
              💵 支払金額 *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-700 font-black text-2xl">¥</span>
              <input
                type="number"
                id="paymentAmount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-3 border-red-400 focus:border-red-600 focus:outline-none font-black text-2xl text-gray-900 rounded-lg bg-gradient-to-r from-yellow-50 to-red-50"
                placeholder="1000"
                min="500"
                step="100"
                required
              />
            </div>
            <p className="text-xs text-red-700 mt-2 font-black bg-red-50 p-2 rounded">✨ 最低金額: 500円</p>
          </div>

          <div className="bg-white/80 p-4 rounded-lg">
            <label className="block text-sm font-black mb-3 text-blue-700">
              💳 支払方法 *
            </label>
            <div className="grid grid-cols-3 gap-4">
              {/* クレジットカード */}
              <button
                type="button"
                onClick={() => setPaymentMethod('credit')}
                className={`p-4 border-4 rounded-xl transition-all transform hover:scale-105 ${
                  paymentMethod === 'credit'
                    ? 'border-blue-600 bg-gradient-to-br from-blue-100 to-blue-200 shadow-xl ring-4 ring-blue-300'
                    : 'border-blue-300 bg-white hover:border-blue-500'
                }`}
              >
                <div className="text-4xl mb-2">💳</div>
                <p className="text-xs font-black text-blue-700">クレジット<br/>カード</p>
              </button>

              {/* PayPay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('paypay')}
                className={`p-4 border-4 rounded-xl transition-all transform hover:scale-105 ${
                  paymentMethod === 'paypay'
                    ? 'border-red-600 bg-gradient-to-br from-red-100 to-red-200 shadow-xl ring-4 ring-red-300'
                    : 'border-red-300 bg-white hover:border-red-500'
                }`}
              >
                <div className="text-4xl mb-2">📱</div>
                <p className="text-xs font-black text-red-600">PayPay</p>
              </button>

              {/* auPay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('aupay')}
                className={`p-4 border-4 rounded-xl transition-all transform hover:scale-105 ${
                  paymentMethod === 'aupay'
                    ? 'border-orange-600 bg-gradient-to-br from-orange-100 to-orange-200 shadow-xl ring-4 ring-orange-300'
                    : 'border-orange-300 bg-white hover:border-orange-500'
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
          className="w-full bg-gradient-to-r from-red-600 via-yellow-500 to-blue-600 hover:from-red-700 hover:via-yellow-600 hover:to-blue-700 text-white font-black py-5 px-6 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed border-4 border-yellow-400 tracking-wider text-xl rounded-xl shadow-2xl transform hover:scale-105"
        >
          {isLoading ? '🔄 発行中...' : `🎴 ¥${paymentAmount || '0'}で NFTを発行する`}
        </button>
      </form>
    </div>
  );
}
