"use client";

import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "@/components/helper/RainbowKitCustomConnectButton";
import { Header } from "./_components/Header";
import { AdminPanel } from "./_components/AdminPanel";
import { ProtectoraPanel } from "./_components/ProtectoraPanel";
import { DonationPool } from "./_components/DonationPool";
import { DonorPanel } from "./_components/DonorPanel";
import { RoleConfig } from "./_components/RoleConfig";
import { useDonationSystem } from "@/hooks/donation-system/useDonationSystem";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { currentRole } = useDonationSystem();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative overflow-hidden rounded-2xl border border-[#FFD208]/30 bg-gradient-to-br from-[#FFF7CC] via-white to-[#FFF7CC]/50 px-8 py-12 text-center shadow-xl backdrop-blur sm:px-12 md:px-16">
          <div className="relative z-10">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm text-sm font-semibold font-arcade text-[11px]">
                <span className="text-lg">✨</span>
                <span className="flex items-center gap-2">
                  <span className="sr-only">Welcome to RescueDAO</span>
                  <span className="normal-case">Welcome to RescueDAO</span>
                </span>
              </div>
              <h1 className="mt-5 text-4xl md:text-[44px] font-extrabold tracking-tight">Connect your wallet to continue</h1>
              <p className="mt-3 max-w-2xl text-base sm:text-lg text-[#3F3F3F]">
                Once connected, we detect your role and unlock the corresponding dashboard: admin, shelter or donor.
              </p>
              <div className="mt-6 inline-flex items-center gap-4 flex-wrap text-xs text-[#2D2D2D] font-semibold">
                <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm font-arcade">
                  🔒 Non-custodial
                </span>
                <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm font-arcade">
                  🛠️ Built for Sepolia
                </span>
                <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm font-arcade">
                  🐾 Shelter first
                </span>
              </div>
              <div className="mt-8">
                <RainbowKitCustomConnectButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFF7CC]/30 via-white to-[#FFF7CC]/20">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {currentRole === "admin" && <AdminPanel />}
          {currentRole === "protectora" && <ProtectoraPanel />}
          {currentRole === "donor" && <DonorPanel />}
          {!currentRole && <DonationPool />}
          <RoleConfig />
        </div>
      </main>
      
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Built with Stylus SDK (Rust) + Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
