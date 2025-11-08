"use client";

import { useMemo, useState } from "react";
import { useDonationSystem } from "@/hooks/donation-system/useDonationSystem";

const PawPrintSvg = ({ className = "w-20 h-20", ...props }: any) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M47.5 18c2.8-3.6 2.3-8.7-1-12-3.3-3.3-8.4-3.8-12-1-3.2 2.5-4.3 6.9-3.4 10.8" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.12" />
  </svg>
);

export function DonationPool() {
  const { config } = useDonationSystem();

  const sectionClass = "relative overflow-hidden rounded-2xl border border-[#FFD208]/30 bg-gradient-to-br from-[#FFF7CC] via-white to-[#FFF7CC]/50 p-6 shadow-xl backdrop-blur";
  const titleClass = "text-xl font-bold text-[#2D2D2D] mb-2";

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className={sectionClass}>
        <div className="absolute -bottom-8 -right-8 opacity-8 pointer-events-none transform rotate-6">
          <PawPrintSvg className="w-32 h-32" />
        </div>
        <div className="absolute -top-12 -left-12 pointer-events-none transform -rotate-6 opacity-30">
          <PawPrintSvg className="w-56 h-56" />
        </div>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none transform rotate-3 opacity-25">
          <PawPrintSvg className="w-48 h-48" />
        </div>

        <div className="relative z-10">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm text-sm font-semibold font-arcade text-[11px]">
              <span className="text-lg">🐾</span>
              <span className="flex items-center gap-2">
                <span className="sr-only">Welcome to RescueDAO</span>
                <span className="normal-case">Welcome to RescueDAO</span>
              </span>
            </div>
            <h1 className="mt-5 text-4xl md:text-[44px] font-extrabold tracking-tight">Help animals by making a donation</h1>
            <p className="mt-3 max-w-2xl text-base sm:text-lg text-[#3F3F3F]">
              Support verified animal shelters with transparent, on-chain donations. Every contribution makes a real difference in the lives of rescued animals.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm">
              <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
                <p className="font-arcade text-[10px] text-gray-600 uppercase tracking-wide">Step 1</p>
                <p className="font-semibold text-[#2D2D2D]">Choose a shelter</p>
              </div>
              <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
                <p className="font-arcade text-[10px] text-gray-600 uppercase tracking-wide">Step 2</p>
                <p className="font-semibold text-[#2D2D2D]">Set amount & cadence</p>
              </div>
              <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
                <p className="font-arcade text-[10px] text-gray-600 uppercase tracking-wide">Step 3</p>
                <p className="font-semibold text-[#2D2D2D]">Confirm in your wallet</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation form */}
      <div className={sectionClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className={titleClass}>💝 Make a Donation</h3>
            <p className="text-sm text-gray-500">Choose a verified shelter below and enter your donation amount.</p>
          </div>
        </div>

        {Object.keys(config.protectoras).length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🏠</div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No shelters available yet</h4>
            <p className="text-gray-500">
              Ask an administrator to register some shelters first, or check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {Object.entries(config.protectoras).map(([address, info]) => (
                <div key={address} className="border border-gray-200 rounded-lg p-4 hover:border-[#FFD208] transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#FFD208] rounded-full flex items-center justify-center">
                      <span className="text-lg">🏠</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{info.nombre}</h4>
                      <p className="text-xs text-gray-500 font-mono break-all">{address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="0.01"
                      step="0.01"
                      min="0"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FFD208] focus:border-[#FFD208]"
                    />
                    <span className="text-sm text-gray-600">ETH</span>
                    <button className="bg-[#FFD208] hover:bg-[#E6BD00] text-[#2D2D2D] font-semibold px-4 py-2 rounded transition-colors">
                      Donate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}