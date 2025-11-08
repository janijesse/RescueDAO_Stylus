'use client'

import { useState } from 'react'
import { useConnect, useAccount, useBalance } from 'wagmi'
import { metaMask } from 'wagmi/connectors'
import { usePoolSystem } from '@/hooks/usePoolSystemSimple'

export default function DonationPool() {
  const [amount, setAmount] = useState('')
  const { connect } = useConnect()
  const { isConnected, address } = useAccount()
  const { data: balance } = useBalance({ address })
  const {
    donateToPool,
    isProcessing,
    message
  } = usePoolSystem()

  const handleConnectAndDonate = async () => {
    if (!isConnected) {
      connect({ connector: metaMask() })
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    await donateToPool(amount)
  }

  return (
    <div className="bg-white shadow-lg p-6 mb-8 rounded-2xl border border-gray-100 text-gray-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-[#2D2D2D] text-xl mb-3 flex items-center gap-2">
            💧 Pool Donations
          </h3>
          <p className="text-sm text-gray-500">
            Funds are distributed equally among all registered shelters. No custodial steps, ever.
          </p>
        </div>
        {isProcessing && (
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#2080C0] bg-[#E6F3FF] border border-[#28A0F0] px-3 py-1 rounded-full font-arcade">
            <span className="inline-block h-2 w-2 rounded-full bg-[#2080C0] animate-pulse" /> Processing…
          </span>
        )}
      </div>
      
      <div className="space-y-5">
        <div>
          <label htmlFor="poolAmount" className="block text-gray-700 font-medium mb-2">
            Amount (ETH Sepolia) *
          </label>
          <input
            id="poolAmount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28A0F0] text-gray-900"
            disabled={isProcessing}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-xs text-gray-500 font-arcade">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#28A0F0]" />
            Switching networks in your wallet may be required before confirming.
          </span>
          <button 
            onClick={handleConnectAndDonate}
            disabled={isProcessing}
            className="inline-flex items-center justify-center px-6 py-3 font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed rounded-xl bg-[#28A0F0] text-white hover:bg-[#2080C0] focus-visible:ring-[#2080C0]"
          >
            {!isConnected ? (
              <>🔗 Connect & Donate to Pool</>
            ) : isProcessing ? (
              <>⏳ Processing...</>
            ) : (
              <>� Donate to Pool</>
            )}
          </button>
        </div>
      </div>
      
      {message && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            message.includes("Error")
              ? "bg-red-50 text-red-800 border border-red-200"
              : "bg-green-50 text-green-800 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-600">
        <p className="mb-1">Pool donations are automatically distributed to all registered shelters.</p>
        <p>Ensure you have enough ETH balance before confirming the transaction.</p>
      </div>
    </div>
  )
}