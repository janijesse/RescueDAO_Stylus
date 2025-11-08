"use client";

import { useMemo } from "react";
import { useDonationSystem } from "@/hooks/donation-system/useDonationSystem";
import { RainbowKitCustomConnectButton } from "@/components/helper/RainbowKitCustomConnectButton";

export function Header() {
  const { currentRole } = useDonationSystem();

  const roleTitle = useMemo(() => {
    switch (currentRole) {
      case 'admin':
        return 'Administrador';
      case 'protectora':
        return 'Protectora';
      case 'donor':
        return 'Donante';
      default:
        return 'Visitante';
    }
  }, [currentRole]);

  const roleIcon = useMemo(() => {
    switch (currentRole) {
      case 'admin':
        return '👑';
      case 'protectora':
        return '🏠';
      case 'donor':
        return '❤️';
      default:
        return '👋';
    }
  }, [currentRole]);

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <h1 className="text-xl font-bold text-gray-900">
                RescueDAO
              </h1>
            </div>
            {currentRole && (
              <div className="hidden sm:flex items-center gap-2 bg-[#FFF7CC] border border-[#FFD208]/30 px-3 py-1 rounded-full">
                <span className="text-sm">{roleIcon}</span>
                <span className="text-sm font-medium text-[#2D2D2D]">
                  {roleTitle}
                </span>
              </div>
            )}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            {/* Mobile role indicator */}
            {currentRole && (
              <div className="sm:hidden flex items-center gap-2 bg-[#FFF7CC] border border-[#FFD208]/30 px-2 py-1 rounded-full">
                <span className="text-sm">{roleIcon}</span>
                <span className="text-xs font-medium text-[#2D2D2D]">
                  {roleTitle}
                </span>
              </div>
            )}
            
            <RainbowKitCustomConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}