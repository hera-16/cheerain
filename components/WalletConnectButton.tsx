'use client';

import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect } from 'wagmi'
import { useState, useEffect } from 'react'

export default function WalletConnectButton() {
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)

  // クライアントサイドでのみレンダリングするためのフラグ
  useEffect(() => {
    setMounted(true)
  }, [])

  // ウォレットアドレスを短縮表示
  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // SSR時は何も表示しない（Hydration Errorを防ぐ）
  if (!mounted) {
    return (
      <button
        disabled
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg opacity-50 cursor-wait"
      >
        読み込み中...
      </button>
    )
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
          {shortenAddress(address)}
        </div>
        <button
          onClick={() => disconnect()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          切断
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => open()}
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105"
    >
      ウォレットを接続
    </button>
  )
}
