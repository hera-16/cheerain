'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { NFTFormData } from '@/types/nft';
import { defaultImages, generateDefaultImageDataURL } from '@/lib/defaultImages';
import { Player } from '@/types/player';
import { api } from '@/lib/api';
import { checkTextContent, checkImageBasic } from '@/lib/contentModeration';
import { getContractConfig } from '@/lib/contract';
import { parseEther } from 'viem';
import WalletConnectButton from './WalletConnectButton';

type PaymentMethod = 'credit' | 'paypay' | 'aupay';

export default function BlockchainNFTMintForm() {
  const { address, isConnected } = useAccount();
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const [formData, setFormData] = useState<NFTFormData>({
    title: '',
    message: '',
    playerName: '',
    image: null,
  });
  const [preview, setPreview] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [venueId, setVenueId] = useState<string>('');
  const [selectedDefaultImage, setSelectedDefaultImage] = useState<number | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  // 選手データを取得
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await api.get<Player[]>('/players');
        if (response.success && response.data) {
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

  // トランザクション成功時の処理
  useEffect(() => {
    if (isConfirmed && hash) {
      alert(`✅ NFTがブロックチェーン上に発行されました！\n\nトランザクションハッシュ: ${hash}\n\nhttps://amoy.polygonscan.com/tx/${hash}`);

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
    }
  }, [isConfirmed, hash]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageCheck = checkImageBasic(file);
      if (!imageCheck.isValid) {
        alert(`❌ 画像エラー\n\n${imageCheck.error}`);
        e.target.value = '';
        return;
      }

      setFormData({ ...formData, image: file });
      setSelectedDefaultImage(null);
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
    setFormData({ ...formData, image: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      alert('NFTを発行するにはウォレットを接続してください');
      return;
    }

    const contractConfig = getContractConfig();
    if (!contractConfig) {
      alert('❌ NFTコントラクトが設定されていません。\n\nデプロイしてNEXT_PUBLIC_NFT_CONTRACT_ADDRESSを設定してください。');
      return;
    }

    if (!paymentAmount || parseFloat(paymentAmount) < 500) {
      alert('支払金額は500円以上を入力してください');
      return;
    }

    if (venueId && !/^\d{5}$/.test(venueId)) {
      alert('会場IDは5桁の数字で入力してください');
      return;
    }

    // コンテンツモデレーションチェック
    const moderationResult = checkTextContent(formData.title, formData.message);
    if (!moderationResult.isClean) {
      alert(
        `❌ 不適切な内容が検出されました\n\n` +
        `以下の表現が含まれています:\n${moderationResult.foundWords.join(', ')}\n\n` +
        `選手への応援は、前向きで建設的なメッセージでお願いします。`
      );
      return;
    }

    if (moderationResult.warnings.length > 0) {
      const confirm = window.confirm(
        `⚠️ 以下の表現が含まれています:\n${moderationResult.warnings.join(', ')}\n\n` +
        `このまま投稿してもよろしいですか？`
      );
      if (!confirm) {
        return;
      }
    }

    try {
      // 画像の取得: デフォルト画像または自前の画像
      let imageUrl = '';

      if (selectedDefaultImage !== null) {
        imageUrl = generateDefaultImageDataURL(selectedDefaultImage);
      } else if (formData.image) {
        // 画像をアップロード
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

      // ブロックチェーンNFTを発行
      writeContract({
        ...contractConfig,
        functionName: 'mintNFT',
        args: [
          address, // to
          formData.title,
          formData.message,
          formData.playerName,
          imageUrl,
          BigInt(Math.floor(parseFloat(paymentAmount) * 100)), // paymentAmount (円を整数化)
          venueId ? true : false, // isVenueAttendee
        ],
      });

    } catch (error: any) {
      console.error('Error minting NFT:', error);
      alert(`❌ エラー\n\n${error.message || 'NFTの発行に失敗しました'}`);
    }
  };

  // ローディング中
  if (loadingPlayers) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-gray-600">選手データを読み込み中...</p>
      </div>
    );
  }

  // ポジションでグループ化
  const groupedPlayers: Record<string, Player[]> = {};
  players.forEach((player) => {
    if (!groupedPlayers[player.position]) {
      groupedPlayers[player.position] = [];
    }
    groupedPlayers[player.position].push(player);
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        ブロックチェーンNFT応援カード発行
      </h2>

      {/* ウォレット接続状態 */}
      <div className="mb-6 flex justify-center">
        <WalletConnectButton />
      </div>

      {!isConnected && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-center">
            ⚠️ NFTを発行するにはウォレットを接続してください
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* タイトル */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="例: 次の試合も頑張ってください！"
            required
            disabled={!isConnected}
          />
        </div>

        {/* 応援メッセージ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            応援メッセージ <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
            placeholder="選手への応援メッセージを入力してください"
            required
            disabled={!isConnected}
          />
        </div>

        {/* 選手選択 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            応援する選手 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.playerName}
            onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={!isConnected}
          >
            <option value="">選手を選択してください</option>
            {Object.entries(groupedPlayers).map(([position, playersInPosition]) => (
              <optgroup key={position} label={position}>
                {playersInPosition.map((player) => (
                  <option key={player.id} value={player.name}>
                    {player.number}. {player.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* デフォルト画像選択 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            デフォルト画像から選択
          </label>
          <div className="grid grid-cols-5 gap-2">
            {defaultImages.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => handleDefaultImageSelect(img.id)}
                className={`p-2 border-2 rounded-lg hover:border-blue-500 transition-colors ${
                  selectedDefaultImage === img.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                disabled={!isConnected}
              >
                <div
                  className="w-full h-20 bg-gradient-to-br rounded flex items-center justify-center"
                  style={{ backgroundImage: img.gradient }}
                >
                  <span className="text-2xl">{img.emoji}</span>
                </div>
                <p className="text-xs text-center mt-1 text-gray-600">{img.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* カスタム画像アップロード */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            または自分の画像をアップロード
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            disabled={!isConnected}
          />
          <p className="text-sm text-gray-500 mt-1">最大10MB（PNG, JPG, GIF対応）</p>
        </div>

        {/* プレビュー */}
        {preview && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">プレビュー</label>
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded" />
            </div>
          </div>
        )}

        {/* 支払金額 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            支払金額（円） <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="500"
            min="500"
            required
            disabled={!isConnected}
          />
          <p className="text-sm text-gray-500 mt-1">最低金額: 500円</p>
        </div>

        {/* 支払方法 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">支払方法</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="credit"
                checked={paymentMethod === 'credit'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="mr-2"
                disabled={!isConnected}
              />
              クレジットカード
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="paypay"
                checked={paymentMethod === 'paypay'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="mr-2"
                disabled={!isConnected}
              />
              PayPay
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="aupay"
                checked={paymentMethod === 'aupay'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="mr-2"
                disabled={!isConnected}
              />
              auPay
            </label>
          </div>
        </div>

        {/* 会場ID（オプション） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            会場ID（現地参加の場合のみ）
          </label>
          <input
            type="text"
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="12345"
            maxLength={5}
            disabled={!isConnected}
          />
          <p className="text-sm text-gray-500 mt-1">
            スタジアムで配布された5桁の会場IDを入力してください
          </p>
        </div>

        {/* エラー表示 */}
        {writeError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              ❌ エラー: {writeError.message}
            </p>
          </div>
        )}

        {/* トランザクションハッシュ */}
        {hash && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              トランザクションハッシュ:{' '}
              <a
                href={`https://amoy.polygonscan.com/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-600"
              >
                {hash.slice(0, 10)}...{hash.slice(-8)}
              </a>
            </p>
            {isConfirming && <p className="text-blue-600 mt-2">⏳ 承認待ち...</p>}
            {isConfirmed && <p className="text-green-600 mt-2">✅ 承認完了！</p>}
          </div>
        )}

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={!isConnected || isPending || isConfirming}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            !isConnected || isPending || isConfirming
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          {isPending
            ? '署名待ち...'
            : isConfirming
            ? 'トランザクション承認中...'
            : 'ブロックチェーンNFTを発行'}
        </button>
      </form>

      {/* 注意事項 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          ⚠️ 注意: このNFTはPolygon Amoy Testnetで発行されます。実際の価値はありません。
        </p>
        <p className="text-sm text-gray-600 mt-2">
          ℹ️ テストネットMATICが必要です。{' '}
          <a
            href="https://faucet.polygon.technology/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-700"
          >
            Faucet
          </a>
          から無料で取得できます。
        </p>
      </div>
    </div>
  );
}
