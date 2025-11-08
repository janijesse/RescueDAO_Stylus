"use client";

import { useState, useCallback } from "react";

// Decorative arcade paw + pet icons (small, reusable here)
const PawPrintSvg = ({ className = "w-24 h-24 text-black/8" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="currentColor" aria-hidden>
    <path d="M32 44c-7 0-12 6-12 8s5 4 12 4 12-2 12-4-5-8-12-8zm-14-12c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14-6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14 6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6z" />
  </svg>
);

// Arcade Dog
const ArcadeDogSvg = ({ className = "w-10 h-10 text-[#2D2D2D]" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet">
    <g fill="currentColor">
      <rect x="20" y="20" width="24" height="16" />
      <rect x="16" y="36" width="32" height="12" />
      <rect x="12" y="48" width="8" height="8" />
      <rect x="44" y="48" width="8" height="8" />
      <rect x="24" y="24" width="4" height="4" />
      <rect x="36" y="24" width="4" height="4" />
      <rect x="28" y="28" width="8" height="4" />
    </g>
  </svg>
);

// Arcade Cat
const ArcadeCatSvg = ({ className = "w-10 h-10 text-[#2D2D2D]" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet">
    <g fill="currentColor">
      <rect x="8" y="8" width="4" height="8" />
      <rect x="52" y="8" width="4" height="8" />
      <rect x="12" y="16" width="40" height="16" />
      <rect x="16" y="32" width="32" height="12" />
      <rect x="8" y="44" width="8" height="8" />
      <rect x="48" y="44" width="8" height="8" />
      <rect x="20" y="20" width="4" height="4" />
      <rect x="40" y="20" width="4" height="4" />
      <rect x="28" y="24" width="8" height="4" />
    </g>
  </svg>
);

// Rabbit for variety
const ArcadeRabbitSvg = ({ className = "w-10 h-10 text-[#2D2D2D]" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet">
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
import { useDonationSystem } from "@/hooks/donation-system/useDonationSystem";

export function AdminPanel() {
  const { agregarProtectora, isProcessing, message, listaProtectoras } = useDonationSystem();
  const [shelterAddress, setShelterAddress] = useState("");
  const [shelterName, setShelterName] = useState("");

  // Consistent style classes
  const sectionClass = "relative overflow-hidden rounded-2xl border border-[#2080C0] bg-gradient-to-br from-[#E8F4FD] via-white to-[#E8F4FD]/50 p-6 shadow-xl backdrop-blur";
  const titleClass = "text-xl font-bold text-[#2D2D2D] mb-2";
  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28A0F0] focus:border-[#28A0F0]";

  const handleAddShelter = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shelterAddress.trim() || !shelterName.trim()) {
      alert("Please fill in all fields");
      return;
    }

    await agregarProtectora(shelterAddress, shelterName);
    
    // Reset form on success
    if (!isProcessing) {
      setShelterAddress("");
      setShelterName("");
    }
  }, [shelterAddress, shelterName, agregarProtectora, isProcessing]);

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

          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm text-[11px]">
              <span role="img" aria-label="spark" className="text-lg">⚙️</span>
              <span className="normal-case">RescueDAO</span> Admin
            </div>
            <h1 className="mt-5 text-4xl md:text-[42px] font-extrabold tracking-tight text-[#2D2D2D]"><span className="normal-case">RescueDAO</span> — Admin Panel</h1>
            <p className="mt-3 max-w-2xl text-base sm:text-lg text-[#3F3F3F]">
              Keep the network curated without leaving this minimal console. Add new shelters, monitor addresses, and keep the
              donation flow tidy.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm">
              <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
                <p className="text-[10px] text-gray-600 uppercase tracking-wide">Step 1</p>
                <p className="font-semibold text-[#2D2D2D]">Collect the wallet</p>
              </div>
              <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
                <p className="text-[10px] text-gray-600 uppercase tracking-wide">Step 2</p>
                <p className="font-semibold text-[#2D2D2D]">Assign a friendly name</p>
              </div>
              <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
                <p className="text-[10px] text-gray-600 uppercase tracking-wide">Step 3</p>
                <p className="font-semibold text-[#2D2D2D]">Confirm in the form below</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Shelter */}
      <div className={sectionClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className={titleClass}>➕ Add New Shelter</h3>
            <p className="text-sm text-gray-500">Keep entries short & human readable. Addresses are stored in lowercase.</p>
          </div>
          {isProcessing && (
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#1e40af] bg-[#E8F4FD] border border-[#28A0F0] px-3 py-1 rounded-full">
              <span className="inline-block h-2 w-2 rounded-full bg-[#1e40af] animate-pulse" /> Processing...
            </span>
          )}
          {message && (
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#22c55e] bg-[#f0fdf4] border border-[#22c55e]/30 px-3 py-1 rounded-full">
              ✓ {message}
            </span>
          )}
        </div>
        <form onSubmit={handleAddShelter} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="address" className="block text-gray-700 font-semibold mb-2">
                Wallet address
              </label>
              <input
                id="address"
                type="text"
                value={shelterAddress}
                onChange={(e) => setShelterAddress(e.target.value)}
                placeholder="0x..."
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                Shelter name
              </label>
              <input
                id="name"
                type="text"
                value={shelterName}
                onChange={(e) => setShelterName(e.target.value)}
                placeholder="Hope Animal Rescue"
                className={inputClass}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isProcessing || !shelterAddress.trim() || !shelterName.trim()}
            className="w-full sm:w-auto bg-[#28A0F0] hover:bg-[#2080C0] text-white font-bold px-6 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Adding Shelter..." : "Add Shelter"}
          </button>
        </form>
      </div>

      {/* Lista de Protectoras */}
      {listaProtectoras.length > 0 && (
        <div className={sectionClass}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h3 className={titleClass}>🏠 Registered Shelters</h3>
              <p className="text-sm text-gray-500">Current shelters in the donation network. Monitor and manage access.</p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-[#28A0F0] px-3 py-1 rounded-full">
              {listaProtectoras.length} shelter{listaProtectoras.length === 1 ? "" : "s"}
            </span>
          </div>
          
          <div className="space-y-3">
            {listaProtectoras.map((protectora, index) => (
              <div key={protectora.address} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#28A0F0] text-white font-bold text-sm">
                        {index + 1}
                      </span>
                      <h4 className="font-bold text-[#2D2D2D] text-lg">{protectora.nombre}</h4>
                    </div>
                    <p className="text-sm font-mono text-gray-600 bg-gray-50 px-3 py-2 rounded-lg break-all">
                      {protectora.address}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        ✅ <span>Verified shelter</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        🔗 <span>Ready for donations</span>
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="w-10 h-10 rounded-full bg-[#28A0F0]/20 flex items-center justify-center">
                      🏠
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-[#F0F9FF] border border-[#28A0F0]/30 rounded-xl">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-[#2D2D2D]">Admin tip:</span> These shelters can now receive donations 
              from verified donors. Each entry represents a wallet address that has been approved to participate in the network.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}