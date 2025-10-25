'use client';

import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { polygonAmoy } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { ReactNode } from 'react'

// 0. QueryClientをセットアップ
const queryClient = new QueryClient()

// 1. WalletConnect Project ID を取得
// https://cloud.reown.com/ でプロジェクトを作成
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

// 2. Wagmi Adapterの作成
const wagmiAdapter = new WagmiAdapter({
  networks: [polygonAmoy],
  projectId,
})

// 3. AppKit SDKの作成
createAppKit({
  adapters: [wagmiAdapter],
  networks: [polygonAmoy],
  projectId,
  metadata: {
    name: 'CheeRain',
    description: 'ファンの声を選手に届ける、新しい応援のカタチ',
    url: 'https://cheerain.vercel.app', // あなたのドメインに変更
    icons: ['https://cheerain.vercel.app/icon.png']
  },
  features: {
    analytics: true, // オプション: アナリティクス有効化
  },
})

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
