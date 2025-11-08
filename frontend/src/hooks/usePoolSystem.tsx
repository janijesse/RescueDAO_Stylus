"use client";

import { useCallback, useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseEther, formatEther } from "viem";

// ABI del contrato pool (versión simplificada)
const POOL_ABI = [
  {
    "inputs": [{"name": "_shelterWallet", "type": "address"}],
    "name": "donateToShelter",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "donateToPool",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_shelterWallet", "type": "address"}],
    "name": "getShelterInfo",
    "outputs": [
      {"name": "name", "type": "string"},
      {"name": "balance", "type": "uint256"},
      {"name": "totalReceived", "type": "uint256"},
      {"name": "active", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_to", "type": "address"}, {"name": "_amount", "type": "uint256"}],
    "name": "transferFromPool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Dirección del contrato pool (simulada - en producción sería la real)
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

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Obtener balance de la protectora en el pool
  const { data: shelterInfo, refetch: refetchShelterInfo } = useReadContract({
    address: POOL_CONTRACT_ADDRESS,
    abi: POOL_ABI,
    functionName: 'getShelterInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });

  // Donar al pool general
  const donateToPool = useCallback(async (amount: string) => {
    if (!amount || !address) {
      setMessage("❌ Please provide amount and connect wallet");
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
      setMessage(`❌ Error: ${error.message || "Unknown error"}`);
    }
  }, [writeContract, address]);

  // Donar a una protectora específica
  const donateToShelter = useCallback(async (amount: string, shelterAddress: string) => {
    if (!amount || !shelterAddress || !address) {
      setMessage("❌ Please provide all required information");
      return;
    }

    try {
      setIsProcessing(true);
      setMessage("⚡ Preparing donation to shelter...");
      
      const valueInWei = parseEther(amount);
      
      // Por simplicidad, usamos una transacción directa
      // En producción sería una llamada al contrato
      sendTransaction({
        to: POOL_CONTRACT_ADDRESS,
        value: valueInWei,
        data: ("0x" + "donateToShelter(address)".slice(2) + shelterAddress.slice(2).padStart(64, '0')) as `0x${string}`,
      });
      
    } catch (error: any) {
      console.error("❌ Shelter donation error:", error);
      setIsProcessing(false);
      setMessage(`❌ Error: ${error.message || "Unknown error"}`);
    }
  }, [sendTransaction, address]);

  // Retirar fondos del pool (solo protectoras)
  const withdrawFromPool = useCallback(async () => {
    if (!address) {
      setMessage("❌ Please connect your wallet");
      return;
    }

    try {
      setIsProcessing(true);
      setMessage("⚡ Preparing withdrawal...");
      
      sendTransaction({
        to: POOL_CONTRACT_ADDRESS,
        value: BigInt(0),
        data: ("0x" + "withdrawFunds()".slice(2).padEnd(8, '0')) as `0x${string}`,
      });
      
    } catch (error: any) {
      console.error("❌ Withdrawal error:", error);
      setIsProcessing(false);
      setMessage(`❌ Error: ${error.message || "Unknown error"}`);
    }
  }, [sendTransaction, address]);

  // Transferir desde el pool a una wallet específica
  const transferFromPool = useCallback(async (toAddress: string, amount: string) => {
    if (!toAddress || !amount || !address) {
      setMessage("❌ Please provide recipient address and amount");
      return;
    }

    try {
      setIsProcessing(true);
      setMessage("⚡ Preparing transfer from pool...");
      
      const valueInWei = parseEther(amount);
      
      // Simular llamada al contrato transferFromPool
      sendTransaction({
        to: POOL_CONTRACT_ADDRESS,
        value: BigInt(0),
        data: ("0x" + "transferFromPool(address,uint256)".slice(2) + 
              toAddress.slice(2).padStart(64, '0') + 
              valueInWei.toString(16).padStart(64, '0')) as `0x${string}`,
      });
      
    } catch (error: any) {
      console.error("❌ Transfer error:", error);
      setIsProcessing(false);
      setMessage(`❌ Error: ${error.message || "Unknown error"}`);
    }
  }, [sendTransaction, address]);

  // Información del shelter parseada
  const shelterBalance = shelterInfo ? formatEther(shelterInfo[1] || BigInt(0)) : "0";
  const totalReceived = shelterInfo ? formatEther(shelterInfo[2] || BigInt(0)) : "0";
  const isActiveShelter = shelterInfo ? shelterInfo[3] : false;

  return {
    // States
    isProcessing: isProcessing || isTxPending || isConfirming,
    message,
    txHash,
    
    // Shelter info
    shelterBalance,
    totalReceived,
    isActiveShelter,
    
    // Actions
    donateToPool,
    donateToShelter,
    withdrawFromPool,
    transferFromPool,
    refetchShelterInfo,
    
    // Helpers
    clearMessage: () => setMessage(""),
  };
};