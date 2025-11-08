'use client';

import { useState } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { COUNTER_ABI, COUNTER_CONTRACT_ADDRESS } from '@/lib/contracts';

export function Counter() {
  const [newValue, setNewValue] = useState('');
  const [addValue, setAddValue] = useState('');
  const [mulValue, setMulValue] = useState('');
  const [ethValue, setEthValue] = useState('');

  // Read current number from contract
  const { data: currentNumber, refetch } = useReadContract({
    address: COUNTER_CONTRACT_ADDRESS,
    abi: COUNTER_ABI,
    functionName: 'number',
  });

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Handle successful transaction
  if (isConfirmed) {
    refetch();
  }

  const handleSetNumber = () => {
    if (!newValue) return;
    writeContract({
      address: COUNTER_CONTRACT_ADDRESS,
      abi: COUNTER_ABI,
      functionName: 'setNumber',
      args: [BigInt(newValue)],
    });
    setNewValue('');
  };

  const handleIncrement = () => {
    writeContract({
      address: COUNTER_CONTRACT_ADDRESS,
      abi: COUNTER_ABI,
      functionName: 'increment',
    });
  };

  const handleAddNumber = () => {
    if (!addValue) return;
    writeContract({
      address: COUNTER_CONTRACT_ADDRESS,
      abi: COUNTER_ABI,
      functionName: 'addNumber',
      args: [BigInt(addValue)],
    });
    setAddValue('');
  };

  const handleMulNumber = () => {
    if (!mulValue) return;
    writeContract({
      address: COUNTER_CONTRACT_ADDRESS,
      abi: COUNTER_ABI,
      functionName: 'mulNumber',
      args: [BigInt(mulValue)],
    });
    setMulValue('');
  };

  const handleAddFromMsgValue = () => {
    if (!ethValue) return;
    writeContract({
      address: COUNTER_CONTRACT_ADDRESS,
      abi: COUNTER_ABI,
      functionName: 'addFromMsgValue',
      value: parseEther(ethValue),
    });
    setEthValue('');
  };

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <h2 className="text-3xl font-bold text-center mb-8">Stylus Counter Contract</h2>
      
      {/* Current Value Display */}
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <h3 className="text-lg font-semibold mb-2">Current Number</h3>
        <div className="text-4xl font-bold text-blue-600">
          {currentNumber?.toString() || '0'}
        </div>
      </div>

      {/* Contract Address Info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Contract Address:</strong> {COUNTER_CONTRACT_ADDRESS}
        </p>
        <p className="text-xs text-yellow-600 mt-1">
          Update the contract address in /src/lib/contracts.ts after deployment
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Set Number */}
        <div className="space-y-3">
          <h3 className="font-semibold">Set Number</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Enter number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleSetNumber}
              disabled={isPending || isConfirming || !newValue}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
              Set
            </button>
          </div>
        </div>

        {/* Increment */}
        <div className="space-y-3">
          <h3 className="font-semibold">Increment by 1</h3>
          <button
            onClick={handleIncrement}
            disabled={isPending || isConfirming}
            className="w-full p-2 bg-green-600 text-white rounded disabled:bg-gray-400"
          >
            Increment
          </button>
        </div>

        {/* Add Number */}
        <div className="space-y-3">
          <h3 className="font-semibold">Add Number</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Enter number to add"
              value={addValue}
              onChange={(e) => setAddValue(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleAddNumber}
              disabled={isPending || isConfirming || !addValue}
              className="px-4 py-2 bg-purple-600 text-white rounded disabled:bg-gray-400"
            >
              Add
            </button>
          </div>
        </div>

        {/* Multiply Number */}
        <div className="space-y-3">
          <h3 className="font-semibold">Multiply Number</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Enter multiplier"
              value={mulValue}
              onChange={(e) => setMulValue(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleMulNumber}
              disabled={isPending || isConfirming || !mulValue}
              className="px-4 py-2 bg-orange-600 text-white rounded disabled:bg-gray-400"
            >
              Multiply
            </button>
          </div>
        </div>

        {/* Add from ETH Value */}
        <div className="space-y-3 md:col-span-2">
          <h3 className="font-semibold">Add from ETH Value (Payable)</h3>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.001"
              placeholder="ETH amount"
              value={ethValue}
              onChange={(e) => setEthValue(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleAddFromMsgValue}
              disabled={isPending || isConfirming || !ethValue}
              className="px-4 py-2 bg-red-600 text-white rounded disabled:bg-gray-400"
            >
              Send ETH & Add
            </button>
          </div>
          <p className="text-xs text-gray-600">
            This function adds the wei value of the ETH sent to the contract number
          </p>
        </div>
      </div>

      {/* Transaction Status */}
      {isPending && (
        <div className="text-center text-blue-600">Transaction pending...</div>
      )}
      {isConfirming && (
        <div className="text-center text-yellow-600">Waiting for confirmation...</div>
      )}
      {isConfirmed && (
        <div className="text-center text-green-600">Transaction confirmed!</div>
      )}
      {error && (
        <div className="text-center text-red-600">
          Error: {error.message}
        </div>
      )}
    </div>
  );
}