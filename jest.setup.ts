import '@testing-library/jest-dom'

// Mock環境変数
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8080/api/v1'
process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = 'test-project-id'
process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'
process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL = 'https://rpc-amoy.polygon.technology'
process.env.NEXT_PUBLIC_CHAIN_ID = '80002'

// Mock fetch API
global.fetch = jest.fn()

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as any
