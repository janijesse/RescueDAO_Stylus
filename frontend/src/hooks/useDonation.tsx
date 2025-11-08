'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

export function useDonation() {
  const { address } = useAccount();
  const { 
    sendTransaction, 
    data: txHash, 
    error: txError, 
    isPending: isTxPending,
    isError 
  } = useSendTransaction();
  
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed, 
    error: receiptError 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  // Handle transaction state changes
  useEffect(() => {
    if (isTxPending) {
      setIsProcessing(true);
      setMessage("🔄 Opening wallet... Please confirm the transaction");
    } else if (isConfirming && txHash) {
      setMessage("⏳ Transaction submitted... Waiting for network confirmation");
    } else if (isConfirmed && txHash) {
      setIsProcessing(false);
      setMessage("✅ Donation completed successfully! 🎉");
      // Clear message after 5 seconds
      setTimeout(() => setMessage(""), 5000);
    } else if (txError || receiptError || isError) {
      setIsProcessing(false);
      const errorMsg = txError?.message || receiptError?.message || "Transaction failed";
      
      // Handle specific error types
      if (errorMsg.includes("User rejected") || errorMsg.includes("denied")) {
        setMessage("❌ Transaction cancelled by user");
      } else if (errorMsg.includes("insufficient funds")) {
        setMessage("❌ Insufficient balance for this transaction");
      } else {
        setMessage(`❌ Transaction failed: ${errorMsg}`);
      }
      
      // Clear error message after 10 seconds
      setTimeout(() => setMessage(""), 10000);
    }
  }, [isTxPending, isConfirming, isConfirmed, isError, txError, receiptError, txHash]);

  // Donate to a specific address
  const donate = async (to: `0x${string}`, amount: string) => {
    if (!address) {
      setMessage("❌ Please connect your wallet first");
      return;
    }

    try {
      const value = parseEther(amount);
      await sendTransaction({
        to,
        value,
      });
    } catch (error) {
      console.error("Donation failed:", error);
      setMessage(`❌ Donation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return {
    donate,
    isPending: isTxPending || isConfirming,
    isProcessing,
    message,
    isConnected: !!address,
    txHash,
    isConfirmed,
  };
}