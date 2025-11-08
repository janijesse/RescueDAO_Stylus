'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Counter } from '@/components/Counter';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              RescueDAO Stylus
            </h1>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isConnected ? (
          <div className="px-4 py-6 sm:px-0">
            <Counter />
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to RescueDAO Stylus
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Connect your wallet to interact with the Stylus smart contract
            </p>
            <div className="bg-white p-8 rounded-lg shadow max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">About this dApp</h3>
              <div className="text-left space-y-2">
                <p>• <strong>Backend:</strong> Rust smart contract using Stylus SDK</p>
                <p>• <strong>Frontend:</strong> Next.js with TypeScript and Tailwind CSS</p>
                <p>• <strong>Web3:</strong> Wagmi + RainbowKit for wallet connections</p>
                <p>• <strong>Network:</strong> Arbitrum (Stylus-enabled)</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Built with Stylus SDK (Rust) + Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
