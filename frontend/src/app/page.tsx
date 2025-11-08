"use client";

import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "@/components/helper";
import { Header } from "./_components/Header";
import { AdminPanel } from "./_components/AdminPanel";
import { ProtectoraPanel } from "./_components/ProtectoraPanel";
import { DonorPanel } from "./_components/DonorPanel";
import { RoleConfig } from "./_components/RoleConfig";
import { useDonationSystem } from "@/hooks/donation-system/useDonationSystem";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { currentRole } = useDonationSystem();
  
  console.log("🏠 Home page - Current role:", currentRole);
  console.log("🏠 Home page - User address:", address);
  console.log("🏠 Home page - Is connected:", isConnected);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/95 backdrop-blur-sm px-8 py-12 text-center shadow-2xl sm:px-12 md:px-16">
          {/* Elementos decorativos de fondo */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-linear-to-br from-[#1e40af]/20 to-transparent rounded-full -ml-10 -mt-10"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-linear-to-tl from-[#2563eb]/20 to-transparent rounded-full -mr-8 -mb-8"></div>
          
          <div className="relative z-10">
            {/* Logo/Icon */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-[#1e40af] to-[#1d4ed8] rounded-full shadow-xl mb-4">
                <span className="text-5xl">🐾</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 font-arcade">
              <span className="bg-linear-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                Welcome to RescueDAO
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
              Connect your wallet to support animal shelters through our transparent donation pool system.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <RainbowKitCustomConnectButton />
              </div>
              
              {/* Features list */}
              <div className="mt-8 grid grid-cols-1 gap-3 text-sm text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Secure blockchain transactions</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Transparent fund distribution</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Direct impact on animal welfare</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <Header />
      <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
       
          
          {/* Mostrar el panel correspondiente según el rol */}
          {currentRole === "admin" && (
            <div>
              
              <AdminPanel />
            </div>
          )}
          {currentRole === "protectora" && (
            <div>
              
              <ProtectoraPanel />
            </div>
          )}
          {currentRole === "donor" && (
            <div>
              
              <DonorPanel />
            </div>
          )}
          
          {/* Mostrar mensaje si no hay rol */}
          {!currentRole && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="font-bold">❌ No role assigned</p>
              <p>Configure your role in the section below to access the appropriate panel.</p>
            </div>
          )}
          
          {/* Configuración de roles */}
          <RoleConfig />
        </div>
      </main>
      
      <footer className="relative border-t border-white/10 bg-black/20 backdrop-blur-sm mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-300 text-sm">
            Built with Stylus SDK (Rust) + Next.js - Pool Only Version ✨
          </p>
        </div>
      </footer>
    </div>
  );
}
