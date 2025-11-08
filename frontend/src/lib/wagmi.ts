import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, arbitrumSepolia, sepolia, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RescueDAO Stylus',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'c9ef7c7db86a4e1b7a7ceffd7b4e7b5c',
  chains: [arbitrumSepolia, sepolia, arbitrum, mainnet],
  ssr: true,
});