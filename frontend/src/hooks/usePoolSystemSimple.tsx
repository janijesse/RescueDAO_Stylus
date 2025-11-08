"use client";

import { useCallback, useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";

// ABI simplificado para la función donateToPool
const POOL_ABI = [
  {
    "inputs": [],
    "name": "donateToPool",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

// Dirección del contrato pool (temporal para testing)
const POOL_CONTRACT_ADDRESS = "0x742d35Cc6558Dbc5e5bF4c4a8e4d4e4bD4e4c4e4" as const;

export const usePoolSystem = () => {
  const { address } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const { 
    writeContract, 
    data: txHash, 
    error: txError, 
    isPending: isTxPending 
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: receiptError 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Manejar estados de transacción
  useEffect(() => {
    if (isTxPending) {
      setIsProcessing(true);
      setMessage("🔄 Opening MetaMask... Please confirm the transaction");
    } else if (isConfirming && txHash) {
      setMessage("⏳ Transaction submitted... Waiting for confirmation");
    } else if (isConfirmed && txHash) {
      setIsProcessing(false);
      setMessage("✅ Pool donation successful! 🎉");
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setMessage(""), 5000);
    } else if (txError || receiptError) {
      setIsProcessing(false);
      const errorMsg = txError?.message || receiptError?.message || "Transaction failed";
      
      if (errorMsg.includes("User rejected") || errorMsg.includes("denied")) {
        setMessage("❌ Transaction cancelled by user");
      } else if (errorMsg.includes("insufficient funds")) {
        setMessage("❌ Insufficient balance for this transaction");
      } else {
        setMessage(`❌ Transaction failed: ${errorMsg}`);
      }
      
      // Limpiar mensaje de error después de 10 segundos
      setTimeout(() => setMessage(""), 10000);
    }
  }, [isTxPending, isConfirming, isConfirmed, txError, receiptError, txHash]);

  // Función para donar al pool
  const donateToPool = useCallback(async (amount: string) => {
    if (!amount || !address) {
      setMessage("❌ Please provide amount and connect wallet");
      return;
    }

    if (parseFloat(amount) <= 0) {
      setMessage("❌ Amount must be greater than 0");
      return;
    }

    try {
      setIsProcessing(true);
      setMessage("⚡ Preparing donation to pool...");
      
      const valueInWei = parseEther(amount);
      
      // Llamar a la función donateToPool del contrato
      writeContract({
        address: POOL_CONTRACT_ADDRESS,
        abi: POOL_ABI,
        functionName: 'donateToPool',
        value: valueInWei,
      });
      
    } catch (error: any) {
      console.error("❌ Pool donation error:", error);
      setIsProcessing(false);
      setMessage(`❌ Error: ${error.shortMessage || error.message || "Unknown error"}`);
    }
  }, [writeContract, address]);

  return {
    donateToPool,
    isProcessing,
    message,
    txHash,
    isConfirmed,
  };
};