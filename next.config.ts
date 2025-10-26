import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: デプロイ時にESLintエラーを無視（本番環境では推奨されない）
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: デプロイ時にTypeScriptエラーを無視（本番環境では推奨されない）
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
    };
    return config;
  },
};

export default nextConfig;
