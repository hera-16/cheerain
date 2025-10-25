'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { NFTFormData } from '@/types/nft';
import { defaultImages, generateDefaultImageDataURL } from '@/lib/defaultImages';
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

  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<NFTFormData>({
    title: '',
    message: '',
    playerName: 'チームを応援',
    image: null,
  });
  const [preview, setPreview] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [venueId, setVenueId] = useState<string>('');
  const [selectedDefaultImage, setSelectedDefaultImage] = useState<number | null>(null);

  // クライアントサイドでのみレンダリングするためのフラグ
  useEffect(() => {
    setMounted(true);
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
        // デフォルト画像の場合は短い識別子を使用（ガスコスト削減）
        imageUrl = `default:${selectedDefaultImage}`;
      } else if (formData.image) {
        // 画像をアップロード
        const formDataObj = new FormData();
        formDataObj.append('file', formData.image);
        formDataObj.append('type', 'nft');

        const uploadResponse = await api.uploadFile('/upload/image', formDataObj);
        if (uploadResponse.success && uploadResponse.data) {
          // ファイル名のみを抽出してガスコスト削減
          // 例: "nfts/abc.jpg" → "nft:abc.jpg"
          const fullPath = uploadResponse.data.url.replace(/^\/+/, '');
          const fileName = fullPath.split('/').pop() || fullPath;
          imageUrl = `nft:${fileName}`;
        } else {
          throw new Error('画像のアップロードに失敗しました');
        }
      } else {
        alert('❌ デフォルト画像を選択するか、カスタム画像をアップロードしてください');
        return;
      }

      // ブロックチェーンNFTを発行
      writeContract({
        address: contractConfig.address,
        abi: contractConfig.abi,
        functionName: 'mintNFT',
        args: [
          address as `0x${string}`, // to
          formData.title,
          formData.message,
          formData.playerName,
          imageUrl,
          BigInt(Math.floor(parseFloat(paymentAmount) * 100)), // paymentAmount (円を整数化)
          venueId ? true : false, // isVenueAttendee
        ],
        gas: 350000n, // ガスリミットを明示的に設定
      });

    } catch (error: unknown) {
      console.error('Error minting NFT:', error);
      const errorMessage = error instanceof Error ? error.message : 'NFTの発行に失敗しました';
      alert(`❌ エラー\n\n${errorMessage}`);
    }
  };

  // SSR時はローディング表示（Hydration Errorを防ぐ）
  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          ブロックチェーンNFT応援カード発行
        </h2>
        <div className="text-center py-8 text-gray-500">
          読み込み中...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50 rounded-2xl shadow-2xl border-4 border-blue-600">
      <h2 className="text-4xl font-black mb-8 text-center text-gray-900 drop-shadow-lg">
        ⚡ NFT応援カード発行 ⚡
      </h2>

      {/* ウォレット接続状態 */}
      <div className="mb-6 flex justify-center">
        <WalletConnectButton />
      </div>

      {!isConnected && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-400 to-red-400 border-4 border-red-600 rounded-xl shadow-lg animate-pulse">
          <p className="text-gray-900 text-center font-bold text-lg">
            ⚠️ NFTを発行するにはウォレットを接続してください
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* タイトル */}
        <div className="bg-white p-4 rounded-xl border-4 border-blue-500 shadow-lg">
          <label className="block text-lg font-black text-gray-900 mb-2">
            📝 タイトル <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border-4 border-yellow-400 rounded-lg focus:ring-4 focus:ring-red-500 focus:border-red-500 font-bold text-lg text-gray-900"
            placeholder="例: 次の試合も頑張ってください！"
            required
            disabled={!isConnected}
          />
        </div>

        {/* 応援メッセージ */}
        <div className="bg-white p-4 rounded-xl border-4 border-red-500 shadow-lg">
          <label className="block text-lg font-black text-gray-900 mb-2">
            💬 応援メッセージ <span className="text-red-600">*</span>
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 border-4 border-yellow-400 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-500 h-32 font-bold text-lg text-gray-900"
            placeholder="選手への応援メッセージを入力してください"
            required
            disabled={!isConnected}
          />
        </div>

        {/* 応援対象選択 */}
        <div className="bg-gradient-to-r from-blue-100 to-yellow-100 p-4 rounded-xl border-4 border-yellow-500 shadow-lg">
          <label className="block text-lg font-black text-gray-900 mb-2">
            🎯 応援対象 <span className="text-red-600">*</span>
          </label>
          <div className="w-full px-4 py-3 border-4 border-blue-500 bg-white rounded-lg font-black text-gray-900 text-center text-xl">
            ⚽ チームを応援
          </div>
          <p className="text-sm text-gray-900 mt-2 font-bold">
            現在はチーム全体への応援のみ選択できます
          </p>
        </div>

        {/* デフォルト画像選択 */}
        <div className="bg-gradient-to-r from-yellow-100 to-red-100 p-4 rounded-xl border-4 border-red-500 shadow-lg">
          <label className="block text-lg font-black text-gray-900 mb-3">
            🎨 デフォルト画像から選択
          </label>
          <div className="grid grid-cols-5 gap-3">
            {defaultImages.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => handleDefaultImageSelect(img.id)}
                className={`p-3 border-4 rounded-xl hover:border-yellow-400 hover:scale-110 transition-all transform ${
                  selectedDefaultImage === img.id ? 'border-yellow-400 bg-yellow-200 scale-110 shadow-2xl' : 'border-blue-400 bg-white'
                }`}
                disabled={!isConnected}
              >
                <div
                  className="w-full h-20 bg-gradient-to-br rounded-lg flex items-center justify-center shadow-inner"
                  style={{ backgroundImage: img.gradient }}
                >
                  <span className="text-3xl drop-shadow-lg">{img.emoji}</span>
                </div>
                <p className="text-xs text-center mt-2 font-bold text-gray-900">{img.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* カスタム画像アップロード */}
        <div className="bg-gradient-to-r from-blue-100 to-red-100 p-4 rounded-xl border-4 border-blue-500 shadow-lg">
          <label className="block text-lg font-black text-gray-900 mb-2">
            📷 または自分の画像をアップロード
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-3 border-4 border-yellow-400 rounded-lg bg-white font-bold text-gray-900"
            disabled={!isConnected}
          />
          <p className="text-sm text-gray-900 mt-2 font-bold">最大10MB（PNG, JPG, GIF対応）</p>
        </div>

        {/* プレビュー */}
        {preview && (
          <div className="bg-gradient-to-br from-yellow-100 via-red-100 to-blue-100 p-6 rounded-xl border-4 border-yellow-500 shadow-2xl">
            <label className="block text-2xl font-black text-center text-gray-900 mb-4">✨ プレビュー ✨</label>
            <div className="border-4 border-red-500 rounded-xl p-4 bg-white shadow-inner">
              <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-lg" />
            </div>
          </div>
        )}

        {/* 支払金額 */}
        <div className="bg-gradient-to-r from-red-100 to-yellow-100 p-4 rounded-xl border-4 border-yellow-500 shadow-lg">
          <label className="block text-lg font-black text-gray-900 mb-2">
            💰 支払金額（円） <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            className="w-full px-4 py-3 border-4 border-blue-400 rounded-lg focus:ring-4 focus:ring-red-500 focus:border-red-500 font-black text-2xl text-center text-gray-900"
            placeholder="500"
            min="500"
            required
            disabled={!isConnected}
          />
          <p className="text-sm text-gray-900 mt-2 font-bold">最低金額: 500円</p>
        </div>

        {/* 支払方法 */}
        <div className="bg-gradient-to-r from-blue-100 to-yellow-100 p-4 rounded-xl border-4 border-blue-500 shadow-lg">
          <label className="block text-lg font-black text-gray-900 mb-3">💳 支払方法</label>
          <div className="flex gap-4">
            <label className="flex items-center bg-white px-4 py-2 rounded-lg border-4 border-yellow-400 font-bold cursor-pointer hover:bg-yellow-100 transition-colors text-gray-900">
              <input
                type="radio"
                value="credit"
                checked={paymentMethod === 'credit'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="mr-2 w-5 h-5"
                disabled={!isConnected}
              />
              クレジットカード
            </label>
            <label className="flex items-center bg-white px-4 py-2 rounded-lg border-4 border-red-400 font-bold cursor-pointer hover:bg-red-100 transition-colors text-gray-900">
              <input
                type="radio"
                value="paypay"
                checked={paymentMethod === 'paypay'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="mr-2 w-5 h-5"
                disabled={!isConnected}
              />
              PayPay
            </label>
            <label className="flex items-center bg-white px-4 py-2 rounded-lg border-4 border-blue-400 font-bold cursor-pointer hover:bg-blue-100 transition-colors text-gray-900">
              <input
                type="radio"
                value="aupay"
                checked={paymentMethod === 'aupay'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="mr-2 w-5 h-5"
                disabled={!isConnected}
              />
              auPay
            </label>
          </div>
        </div>

        {/* 会場ID（オプション） */}
        <div className="bg-gradient-to-r from-yellow-100 to-blue-100 p-4 rounded-xl border-4 border-red-500 shadow-lg">
          <label className="block text-lg font-black text-gray-900 mb-2">
            🏟️ 会場ID（現地参加の場合のみ）
          </label>
          <input
            type="text"
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
            className="w-full px-4 py-3 border-4 border-yellow-400 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-500 font-black text-2xl text-center tracking-widest text-gray-900"
            placeholder="12345"
            maxLength={5}
            disabled={!isConnected}
          />
          <p className="text-sm text-gray-900 mt-2 font-bold">
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
          className={`w-full py-6 px-8 rounded-2xl font-black text-2xl text-white transition-all transform border-4 ${
            !isConnected || isPending || isConfirming
              ? 'bg-gray-400 cursor-not-allowed border-gray-500'
              : 'bg-gradient-to-r from-red-600 via-yellow-500 to-blue-600 hover:from-red-700 hover:via-yellow-600 hover:to-blue-700 border-yellow-400 hover:scale-105 shadow-2xl hover:shadow-yellow-400/50 animate-pulse'
          }`}
        >
          {isPending
            ? '⏳ 署名待ち...'
            : isConfirming
            ? '🔄 トランザクション承認中...'
            : '🚀 NFTを発行する！'}
        </button>
      </form>

      {/* 注意事項 */}
      <div className="mt-8 p-6 bg-gradient-to-r from-yellow-200 via-red-200 to-blue-200 rounded-2xl border-4 border-red-500 shadow-xl">
        <p className="text-base text-gray-900 font-bold flex items-center gap-2">
          <span className="text-2xl">⚠️</span>
          注意: このNFTはPolygon Amoy Testnetで発行されます。実際の価値はありません。
        </p>
        <p className="text-base text-gray-900 font-bold mt-3 flex items-center gap-2">
          <span className="text-2xl">ℹ️</span>
          テストネットMATICが必要です。{' '}
          <a
            href="https://faucet.polygon.technology/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 font-black"
          >
            Faucet
          </a>
          から無料で取得できます。
        </p>
      </div>
    </div>
  );
}
