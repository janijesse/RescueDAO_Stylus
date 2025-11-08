"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";

// Helper function to retrieve role configuration from localStorage
const getRoleConfig = (): {
  admin?: string;
  protectoras: Record<string, { nombre: string }>;
  donantes: Record<string, { nombre: string }>;
} => {
  // Check if we're on the client side
  if (typeof window === 'undefined') {
    return { protectoras: {}, donantes: {} };
  }
  
  const saved = localStorage.getItem("donationSystemRoles");
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Partial<{
        admin?: string;
        protectoras: Record<string, { nombre: string }>;
        donantes: Record<string, { nombre: string }>;
      }>;
      return {
        admin: parsed.admin,
        protectoras: parsed.protectoras || {},
        donantes: parsed.donantes || {},
      };
    } catch (e) {
      return { protectoras: {}, donantes: {} };
    }
  }
  return { protectoras: {}, donantes: {} };
};

export const useDonationSystem = () => {
  const { address } = useAccount();
  const { sendTransaction, data: txHash, error: txError, isPending: isTxPending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash: txHash,
  });
  
  const [config, setConfig] = useState<{
    admin?: string;
    protectoras: Record<string, { nombre: string }>;
    donantes: Record<string, { nombre: string }>;
  }>(() => ({ protectoras: {}, donantes: {} }));
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  // Initialize config on client side
  useEffect(() => {
    setConfig(getRoleConfig());
  }, []);

  // Handle transaction state changes
  useEffect(() => {
    console.log("📊 Transaction state:", { 
      isTxPending, 
      isConfirming, 
      isConfirmed, 
      txHash: txHash?.slice(0, 10) + "...",
      txError: txError?.message,
      receiptError: receiptError?.message 
    });
    
    if (isTxPending) {
      setIsProcessing(true);
      setMessage("Transaction pending... Please confirm in your wallet");
    } else if (isConfirming) {
      setMessage("Transaction submitted... Waiting for confirmation");
    } else if (isConfirmed) {
      setIsProcessing(false);
      setMessage("✅ Transaction confirmed! Donation completed successfully 🎉");
      console.log("🎉 Transaction confirmed! Hash:", txHash);
    } else if (txError || receiptError) {
      setIsProcessing(false);
      const errorMsg = txError?.message || receiptError?.message || "Transaction failed";
      setMessage(`❌ Error: ${errorMsg}`);
      console.error("❌ Transaction failed:", { txError, receiptError });
    }
  }, [isTxPending, isConfirming, isConfirmed, txError, receiptError, txHash]);

  // Refresh config when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setConfig(getRoleConfig());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Determine current user's role
  const currentRole = useMemo(() => {
    if (!address) return null;
    
    const lowerAddress = address.toLowerCase();
    
    if (config.admin === lowerAddress) return "admin";
    if (config.protectoras[lowerAddress]) return "protectora";
    if (config.donantes[lowerAddress]) return "donor";
    
    return null;
  }, [address, config]);

  // Get current protectora info if user is a protectora
  const currentProtectora = useMemo(() => {
    if (!address || currentRole !== "protectora") return null;
    return config.protectoras[address.toLowerCase()];
  }, [address, currentRole, config.protectoras]);

  // Get current donor info if user is a donor
  const currentDonor = useMemo(() => {
    if (!address || currentRole !== "donor") return null;
    return config.donantes[address.toLowerCase()];
  }, [address, currentRole, config.donantes]);

  // Lista de protectoras
  const listaProtectoras = useMemo(() => {
    return Object.entries(config.protectoras).map(([address, info]) => ({
      address,
      nombre: info.nombre,
    }));
  }, [config.protectoras]);

  // Lista de donantes
  const listaDonantes = useMemo(() => {
    return Object.entries(config.donantes).map(([address, info]) => ({
      address,
      nombre: info.nombre,
    }));
  }, [config.donantes]);

  // Función para donar (real wallet transaction)
  const donar = useCallback(async (amount: string, shelter: string) => {
    console.log("🚀 Donation initiated:", { amount, shelter });
    
    if (!amount || !shelter) {
      setMessage("Please provide amount and shelter address");
      return;
    }

    try {
      setIsProcessing(true);
      setMessage("Preparing transaction...");
      console.log("💰 Sending transaction:", { 
        to: shelter, 
        value: parseEther(amount).toString(),
        amountETH: amount 
      });
      
      // Send ETH transaction to shelter address
      await sendTransaction({
        to: shelter as `0x${string}`,
        value: parseEther(amount),
      });
      
      console.log("✅ Transaction sent, waiting for confirmation...");
      // Transaction state will be handled by useEffect above
    } catch (error: any) {
      console.error("❌ Transaction error:", error);
      setIsProcessing(false);
      setMessage(`Error initiating transaction: ${error.message}`);
    }
  }, [sendTransaction]);

  // Función para donación recurrente (real wallet transaction)
  const donarRecurrente = useCallback(async (amount: string, shelter: string, frequency: string, occurrences: number) => {
    if (!amount || !shelter || !occurrences) {
      setMessage("Please provide all required fields for recurring donation");
      return;
    }

    try {
      setIsProcessing(true);
      setMessage("Preparing first donation of recurring series...");
      
      // For now, send the first donation immediately
      // In a real implementation, you might deploy a contract that handles recurring donations
      await sendTransaction({
        to: shelter as `0x${string}`,
        value: parseEther(amount),
      });
      
      // Note: This is just the first donation. Real recurring functionality would require
      // a smart contract or off-chain automation service
      setMessage(`First donation sent! Note: Additional ${occurrences - 1} donations would need automation setup.`);
      
    } catch (error: any) {
      setIsProcessing(false);
      setMessage(`Error initiating recurring donation: ${error.message}`);
    }
  }, [sendTransaction]);

  // Función para agregar protectora (admin only)
  const agregarProtectora = useCallback(async (address: string, name: string) => {
    setIsProcessing(true);
    setMessage("");
    
    try {
      const newConfig = {
        ...config,
        protectoras: {
          ...config.protectoras,
          [address.toLowerCase()]: { nombre: name },
        },
      };
      setConfig(newConfig);
      if (typeof window !== 'undefined') {
        localStorage.setItem("donationSystemRoles", JSON.stringify(newConfig));
      }
      setMessage(`Shelter "${name}" added successfully!`);
    } catch (error) {
      setMessage("Error adding shelter. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [config]);

  return {
    currentRole,
    currentProtectora,
    currentDonor,
    config,
    refreshConfig: () => setConfig(getRoleConfig()),
    listaProtectoras,
    listaDonantes,
    isProcessing: isProcessing || isTxPending || isConfirming,
    message,
    userAddress: address,
    donar,
    donarRecurrente,
    agregarProtectora,
    refetchPool: () => {}, // placeholder
    // Additional transaction state
    txHash,
    isConfirmed,
  };
};