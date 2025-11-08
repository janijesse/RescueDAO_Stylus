"use client";

import { useState, useMemo } from "react";
import { useDonationSystem } from "@/hooks/donation-system/useDonationSystem";

// Decorative arcade pet icons
const ArcadeDogSvg = ({ className = "w-12 h-12" }: { className?: string }) => (
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

const ArcadeCatSvg = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet">
    <g fill="currentColor">
      <path d="M47.2 23.6c3.6-2.6 6.2-7.6 4.8-11.6-1.6-4.9-7.4-6.1-11.1-3.3-3.6 2.6-6.1 7.6-4.8 11.6 1.6 4.9 7.4 6.1 11.1 3.3zM18.8 23.6c-3.6-2.6-6.2-7.6-4.8-11.6 1.6-4.9 7.4-6.1 11.1-3.3 3.6 2.6 6.1 7.6 4.8 11.6-1.6 4.9-7.4 6.1-11.1 3.3zM32 34.5c4.7 0 8.5 3.8 8.5 8.5s-3.8 8.5-8.5 8.5-8.5-3.8-8.5-8.5 3.8-8.5 8.5-8.5z" />
    </g>
  </svg>
);

const ArcadeRabbitSvg = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden shapeRendering="crispEdges" preserveAspectRatio="xMidYMid meet">
    <g fill="currentColor">
      {/* ears */}
      <rect x="22" y="4" width="4" height="10" />
      <rect x="28" y="4" width="4" height="10" />

      {/* head / body */}
      <rect x="18" y="14" width="16" height="10" />
      <rect x="14" y="24" width="24" height="12" />

      {/* feet */}
      <rect x="16" y="36" width="6" height="6" />
      <rect x="30" y="36" width="6" height="6" />
    </g>
  </svg>
);

// Paw print decorative SVG used as faint background in panels
const PawPrintSvg = ({ className = "w-24 h-24 text-black/10" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="currentColor" aria-hidden>
    <path d="M32 44c-7 0-12 6-12 8s5 4 12 4 12-2 12-4-5-8-12-8zm-14-12c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14-6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zm14 6c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6z" />
  </svg>
);

interface Pet {
  id: string;
  name: string;
  species: string;
  story: string;
  dateAdded: string;
}

export function ProtectoraPanel() {
  const { currentProtectora } = useDonationSystem();
  const [pets, setPets] = useState<Pet[]>([]);
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState("");
  const [petStory, setPetStory] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const sectionClass = "relative overflow-hidden rounded-2xl border border-[#2080C0] bg-gradient-to-br from-[#E8F4FD] via-white to-[#E8F4FD]/50 p-6 shadow-xl backdrop-blur";
  const titleClass = "text-xl font-bold text-[#2D2D2D] mb-2";
  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28A0F0] focus:border-[#28A0F0]";

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!petName.trim() || !petSpecies.trim()) {
      alert("Please fill in pet name and species");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPet: Pet = {
        id: Date.now().toString(),
        name: petName.trim(),
        species: petSpecies.trim(),
        story: petStory.trim() || "A lovely pet looking for a forever home.",
        dateAdded: new Date().toLocaleDateString(),
      };
      
      setPets(prev => [...prev, newPet]);
      
      // Reset form
      setPetName("");
      setPetSpecies("");
      setPetStory("");
      
      alert(`${newPet.name} has been added to your shelter!`);
    } catch (error) {
      console.error("Error adding pet:", error);
      alert("Error adding pet. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePet = (petId: string) => {
    if (confirm("Are you sure you want to remove this pet?")) {
      setPets(prev => prev.filter(pet => pet.id !== petId));
    }
  };

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
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/60 shadow-sm text-sm font-semibold font-arcade text-[11px]">
              <span className="text-lg">🏠</span>
              <span className="flex items-center gap-2">
                <span className="sr-only">RescueDAO Shelter Hub</span>
                <span className="normal-case">RescueDAO</span> Shelter Hub
              </span>
            </div>
            <h1 className="mt-5 text-4xl md:text-[44px] font-extrabold tracking-tight font-arcade"><span className="normal-case">RescueDAO</span> — Shelter Panel</h1>
            <p className="mt-3 max-w-2xl text-base sm:text-lg text-[#3F3F3F]">
              Manage your shelter operations, showcase adoptable pets, and track donations with a clean, dedicated interface designed for animal rescue organizations.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm">
              <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
                <p className="font-arcade text-[10px] text-gray-600 uppercase tracking-wide">Step 1</p>
                <p className="font-semibold text-[#2D2D2D]">Review pool balance</p>
              </div>
              <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
                <p className="font-arcade text-[10px] text-gray-600 uppercase tracking-wide">Step 2</p>
                <p className="font-semibold text-[#2D2D2D]">Add rescue stories</p>
              </div>
              <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/60 px-4 py-3 shadow-sm">
                <p className="font-arcade text-[10px] text-gray-600 uppercase tracking-wide">Step 3</p>
                <p className="font-semibold text-[#2D2D2D]">Withdraw or earmark funds</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <div className="absolute -bottom-8 -right-8 opacity-8 pointer-events-none transform rotate-6">
          <PawPrintSvg className="w-32 h-32" />
        </div>
        {/* extra paws for Add New Pet panel to ensure paw prints in background */}
        <div className="absolute top-6 right-6 pointer-events-none opacity-6 transform rotate-6">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="absolute left-6 bottom-10 pointer-events-none opacity-5">
          <PawPrintSvg className="w-16 h-16" />
        </div>
        {/* decorative pet icons for visual consistency */}
        <div className="absolute top-4 left-4 pointer-events-none opacity-10">
          <ArcadeDogSvg className="w-12 h-12 text-[#28A0F0]/60" />
        </div>
        <div className="absolute bottom-8 left-8 pointer-events-none opacity-8">
          <ArcadeCatSvg className="w-14 h-14 text-[#2D2D2D]/20" />
        </div>
        <div className="absolute top-3 left-6 opacity-6 pointer-events-none">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="absolute top-16 right-12 opacity-5 pointer-events-none">
          <PawPrintSvg className="w-16 h-16" />
        </div>
        <div className="absolute top-4 right-6 opacity-6 pointer-events-none">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="absolute left-4 top-24 opacity-6 pointer-events-none transform -rotate-6">
          <PawPrintSvg className="w-16 h-16" />
        </div>
        <div className="absolute top-2 right-4 opacity-6 pointer-events-none">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="absolute top-2 right-4 opacity-6 pointer-events-none">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="absolute top-8 left-8 opacity-6 pointer-events-none transform -rotate-6">
          <PawPrintSvg className="w-20 h-20" />
        </div>

        <div className="relative z-10">
          <div className="mb-4">
            <h3 className={titleClass}>🏠 Shelter profile</h3>
            {currentProtectora ? (
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Shelter name:</span> {currentProtectora.nombre}
                </p>
                <p className="text-sm text-gray-600">
                  Verified shelter account. Manage your rescue operations and showcase your animals here.
                </p>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">
                Your account is not registered as a shelter. Contact an administrator to get verified.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Shelter stats */}
      <div className={sectionClass}>
        <div className="absolute top-4 left-6 pointer-events-none opacity-6">
          <PawPrintSvg className="w-32 h-32" />
        </div>
        {/* small pet icons in processing panel */}
        <div className="absolute top-4 right-6 pointer-events-none opacity-10">
          <ArcadeRabbitSvg className="w-12 h-12 text-[#2D2D2D]/30" />
        </div>
        <div className="absolute bottom-6 right-6 pointer-events-none opacity-8">
          <ArcadeDogSvg className="w-12 h-12 text-[#28A0F0]/40" />
        </div>
        <div className="absolute top-6 left-4 opacity-6 pointer-events-none">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="absolute bottom-6 left-6 opacity-6 pointer-events-none transform rotate-12">
          <PawPrintSvg className="w-16 h-16" />
        </div>
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <span>📊</span>
          <span className="text-[#2D2D2D]">Shelter Statistics</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/70 backdrop-blur border border-white/60 rounded-lg p-4">
            <p className="text-2xl font-bold text-[#2D2D2D]">{pets.length}</p>
            <p className="text-sm text-gray-600">Animals in care</p>
          </div>
          <div className="bg-white/70 backdrop-blur border border-white/60 rounded-lg p-4">
            <p className="text-2xl font-bold text-[#2D2D2D]">0 ETH</p>
            <p className="text-sm text-gray-600">Total donations</p>
          </div>
          <div className="bg-white/70 backdrop-blur border border-white/60 rounded-lg p-4">
            <p className="text-2xl font-bold text-[#2D2D2D]">0</p>
            <p className="text-sm text-gray-600">Successful adoptions</p>
          </div>
        </div>
      </div>

      {/* Add New Pet */}
      <div className={sectionClass}>
        <div className="absolute top-2 left-6 opacity-10 pointer-events-none">
          <ArcadeDogSvg className="w-12 h-12 text-[#2D2D2D]/30" />
        </div>
        <div className="absolute top-2 right-6 opacity-10 pointer-events-none">
          <ArcadeCatSvg className="w-12 h-12 text-[#2D2D2D]/30" />
        </div>
        <div className="absolute bottom-10 left-6 opacity-8 pointer-events-none">
          <ArcadeDogSvg className="w-12 h-12 text-[#28A0F0]/40" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className={titleClass}>➕ Add New Pet</h3>
            <p className="text-sm text-gray-500">Share their name and species. Stories matter—keep it short and friendly.</p>
          </div>
          {isProcessing && (
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#1e40af] bg-[#E8F4FD] border border-[#28A0F0] px-3 py-1 rounded-full">
              <span className="inline-block h-2 w-2 rounded-full bg-[#1e40af] animate-pulse" /> Adding...
            </span>
          )}
        </div>

        <form onSubmit={handleAddPet} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="petName" className="block text-gray-700 font-semibold mb-2">
                Pet name
              </label>
              <input
                id="petName"
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Max, Luna, Charlie..."
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="petSpecies" className="block text-gray-700 font-semibold mb-2">
                Species
              </label>
              <input
                id="petSpecies"
                type="text"
                value={petSpecies}
                onChange={(e) => setPetSpecies(e.target.value)}
                placeholder="Dog, Cat, Rabbit..."
                className={inputClass}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="petStory" className="block text-gray-700 font-semibold mb-2">
                Story (optional)
              </label>
              <textarea
                id="petStory"
                value={petStory}
                onChange={(e) => setPetStory(e.target.value)}
                placeholder="A brief, heartwarming story about this pet..."
                className={`${inputClass} h-24 resize-none`}
                rows={3}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isProcessing || !petName.trim() || !petSpecies.trim()}
            className="w-full sm:w-auto bg-[#28A0F0] hover:bg-[#2080C0] text-white font-bold px-6 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Adding Pet..." : "Add Pet"}
          </button>
        </form>
      </div>

      {/* Our Pets */}
      <div className={sectionClass}>
        <div className="absolute bottom-6 left-6 pointer-events-none opacity-9">
          <ArcadeDogSvg className="w-14 h-14 text-[#28A0F0]/40" />
        </div>
        <div className="absolute bottom-6 right-6 opacity-6 pointer-events-none transform rotate-6">
          <PawPrintSvg className="w-24 h-24" />
        </div>
        <div className="absolute left-1/2 bottom-10 -translate-x-1/2 opacity-5 pointer-events-none">
          <PawPrintSvg className="w-20 h-20" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className={titleClass}>📋 Our Pets ({pets.length})</h3>
            <p className="text-sm text-gray-500">Every entry helps donors understand your mission. Keep details concise.</p>
          </div>
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🐾</div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No pets added yet</h4>
            <p className="text-gray-500">
              Add your first rescue animal using the form above to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <div key={pet.id} className="border border-gray-200 rounded-lg p-4 bg-white/50 backdrop-blur">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🐾</span>
                    <h4 className="font-semibold text-gray-900">{pet.name}</h4>
                  </div>
                  <button
                    onClick={() => handleRemovePet(pet.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="Remove pet"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Species:</span> {pet.species}
                </p>
                {pet.story && (
                  <p className="text-xs text-gray-500 mb-2 line-clamp-3">
                    {pet.story}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  Added: {pet.dateAdded}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}