import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, arbitrumSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RescueDAO Stylus',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID', // Get yours at https://cloud.walletconnect.com
  chains: [arbitrum, arbitrumSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});