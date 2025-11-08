"use client";

import { useMemo, useState, useEffect } from "react";
import { useDonationSystem } from "@/hooks/donation-system/useDonationSystem";
import DonationPool from "./DonationPool";

const PawPrintSvg = ({ className = "w-20 h-20 text-black/20", ...props }: any) => (
  <svg viewBox="0 0 64 64" className={className} fill="currentColor" aria-hidden {...props}>
    <path d="M32 44c-7 0-12 6-12 8s5 4 12 4 12-2 12-4-5-8-12-8zm-14-12c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14-6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14 6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6z" />
  </svg>
);

const ArcadeDogTiny = ({ className = "w-12 h-12 text-[#2D2D2D]", ...props }: any) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <rect width="24" height="24" rx="4" fill="#28A0F0" opacity="0.06" />
    <path d="M6 15c1.5-2 4-2 6-1s3 3 4 4" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="10" r="1.2" fill="#2D2D2D" />
    <circle cx="12" cy="9" r="1.2" fill="#2D2D2D" />
  </svg>
);

// Full arcade/pixel pet icons (match other panels)
const ArcadeDogSvg = ({ className = "w-64 h-64 text-[#2D2D2D]", ...props }: any) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet" {...props}>
    <g fill="currentColor">
      <rect x="6" y="4" width="6" height="10" />
      <rect x="12" y="8" width="4" height="6" />
      <rect x="34" y="4" width="6" height="10" />
      <rect x="30" y="8" width="4" height="6" />
      <rect x="10" y="14" width="20" height="10" />
      <rect x="8" y="22" width="24" height="10" />
      <rect x="28" y="20" width="18" height="8" />
      <rect x="36" y="18" width="10" height="4" />
      <rect x="44" y="16" width="6" height="4" />
      <rect x="6" y="30" width="30" height="12" />
      <rect x="36" y="30" width="12" height="10" />
      <rect x="8" y="42" width="6" height="6" />
      <rect x="20" y="42" width="6" height="6" />
      <rect x="32" y="42" width="6" height="6" />
      <rect x="48" y="28" width="4" height="6" />
      <rect x="50" y="24" width="2" height="4" />
    </g>
  </svg>
);

const ArcadeCatSvg = ({ className = "w-56 h-56 text-[#2D2D2D]", ...props }: any) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet" {...props}>
    <g fill="currentColor">
      <rect x="12" y="6" width="6" height="10" />
      <rect x="34" y="6" width="6" height="10" />
      <rect x="16" y="16" width="16" height="8" />
      <rect x="14" y="22" width="20" height="8" />
      <rect x="12" y="30" width="24" height="10" />
      <rect x="10" y="40" width="20" height="8" />
      <rect x="32" y="38" width="18" height="10" />
      <rect x="50" y="34" width="4" height="8" />
      <rect x="52" y="30" width="3" height="4" />
    </g>
  </svg>
);

const ArcadeRabbitSvg = ({ className = "w-48 h-48 text-[#2D2D2D]", ...props }: any) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet" {...props}>
    <g fill="currentColor">
      <rect x="22" y="4" width="4" height="10" />
      <rect x="28" y="4" width="4" height="10" />
      <rect x="18" y="14" width="16" height="10" />
      <rect x="14" y="24" width="24" height="12" />
      <rect x="16" y="36" width="6" height="6" />
      <rect x="30" y="36" width="6" height="6" />
    </g>
  </svg>
);

type DonationType = "one-time" | "recurring";

export const DonorPanel = () => {
  const {
    donar,
    donarRecurrente,
    listaProtectoras,
    listaDonantes,
    isProcessing,
    message,
    refetchPool,
    userAddress,
    isConfirmed,
  } = useDonationSystem();

  const [donationAmount, setDonationAmount] = useState("");
  const [selectedShelter, setSelectedShelter] = useState("");
  const [donationType, setDonationType] = useState<DonationType>("one-time");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [occurrences, setOccurrences] = useState("");

  const currentDonor = useMemo(() => {
    if (!userAddress) return undefined;
    return listaDonantes.find(d => d.address.toLowerCase() === userAddress.toLowerCase());
  }, [listaDonantes, userAddress]);

  // Reset form when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      setDonationAmount("");
      setOccurrences("");
      setSelectedShelter("");
    }
  }, [isConfirmed]);

  const handleDonar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check wallet connection
    if (!userAddress) {
      alert("Please connect your wallet first");
      return;
    }
    
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!selectedShelter) {
      alert("Please select a shelter");
      return;
    }
    
    if (donationType === "recurring") {
      if (!occurrences || parseInt(occurrences) <= 0) {
        alert("Please enter the number of occurrences for the recurring donation");
        return;
      }
      await donarRecurrente(donationAmount, selectedShelter, frequency, parseInt(occurrences));
    } else {
      await donar(donationAmount, selectedShelter);
    }

    // Only clear form on successful transaction
    // The success/error will be handled by the hook's message system
  };

  const sectionClass = "bg-white shadow-lg p-6 mb-8 rounded-2xl border border-gray-100 text-gray-900";
  const titleClass = "font-extrabold text-[#2D2D2D] text-xl mb-3 flex items-center gap-2";
  const buttonClass =
    "inline-flex items-center justify-center px-6 py-3 font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed rounded-xl";
  const primaryButtonClass = `${buttonClass} bg-[#28A0F0] text-white hover:bg-[#2080C0] focus-visible:ring-[#2080C0]`;
  const toggleButtonClass = (active: boolean) =>
    `flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
      active ? "bg-[#28A0F0] text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;
  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28A0F0] text-gray-900";

  return (
    <div className="relative max-w-6xl mx-auto p-6 space-y-10 bg-gray-50">
      {/* Fondo azul con textura de patas - estilo original amarillo pero en azul */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-[#E8F4FD] via-[#D1EBFC] to-[#E3F2FB] opacity-60" />
        <div
          className="absolute inset-0 bg-repeat opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>%3Cpath fill='%2328A0F0' opacity='0.06' d='M32 44c-7 0-12 6-12 8s5 4 12 4 12-2 12-4-5-8-12-8zm-14-12c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14-6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14 6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6z'/%3E%3C/svg%3E\")",
            backgroundSize: "160px 160px",
          }}
        />
      </div>

      {/* Header azul con estilo original */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#28A0F0] via-[#4DB3F5] to-[#7CC7FA] border border-[#2080C0] shadow-xl">
        <div className="absolute -top-12 -left-10 h-40 w-40 rounded-full bg-white/25" />
        <div className="absolute -bottom-16 -right-6 h-44 w-44 rounded-full bg-white/20" />
        <div className="relative px-8 py-10 text-[#2D2D2D]">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm text-[11px] font-arcade">
              <span role="img" aria-label="spark" className="text-lg">🤝</span>
              <span className="normal-case">RescueDAO</span> Donor Hub
            </span>
            {userAddress && (
              <span className="inline-flex items-center gap-2 bg-[#2D374B] text-[#28A0F0] px-4 py-2 rounded-full border border-black/20 shadow-sm text-xs font-bold uppercase tracking-wide font-arcade">
                Wallet {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
              </span>
            )}
            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm text-xs font-bold uppercase tracking-wide font-arcade">
              {listaProtectoras.length} shelter{listaProtectoras.length === 1 ? "" : "s"}
            </span>
          </div>
          
          {/* Decoraciones de fondo estilo original */}
          <div className="absolute -top-8 -right-12 pointer-events-none transform rotate-6 opacity-40">
            <ArcadeDogSvg className="w-64 h-64" />
          </div>
          <div className="absolute -bottom-14 -left-12 pointer-events-none transform -rotate-6 opacity-30">
            <ArcadeCatSvg className="w-56 h-56" />
          </div>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none transform rotate-3 opacity-24">
            <ArcadeRabbitSvg className="w-48 h-48" />
          </div>
          
          <h1 className="mt-5 text-4xl md:text-[42px] font-extrabold tracking-tight">
            <span className="normal-case">RescueDAO</span> — Donor Center
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-[#3F3F3F]">
            Support verified shelters in Sepolia with a minimal, wallet-first experience. Contribute through our pool system.
          </p>
          <div className="mt-6 inline-flex items-center gap-4 flex-wrap text-xs text-[#2D2D2D] font-semibold">
            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm font-arcade">
              🔒 Non-custodial
            </span>
            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm font-arcade">
              🛠️ Built for Sepolia
            </span>
            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm font-arcade">
              🐾 Pool first
            </span>
          </div>
        </div>
      </div>

      {/* Solo el Pool de Donaciones - Estilo original amarillo adaptado a azul */}
      <DonationPool />
    </div>
  );
};