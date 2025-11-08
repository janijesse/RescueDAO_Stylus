import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, arbitrumSepolia, sepolia, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RescueDAO Stylus',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [arbitrumSepolia, sepolia, arbitrum, mainnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});