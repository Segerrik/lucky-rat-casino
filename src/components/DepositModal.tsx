'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther, formatEther } from 'viem';
import { CASINO_ADDRESS, CASINO_ABI } from '@/lib/wagmi';

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
}

export function DepositModal({ open, onClose }: DepositModalProps) {
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState('0.005');

  const { data: playerBalance, refetch: refetchBalance } = useReadContract({
    address: CASINO_ADDRESS,
    abi: CASINO_ABI,
    functionName: 'balances',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isSuccess: txSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (txSuccess) refetchBalance();
  }, [txSuccess, refetchBalance]);

  const formattedBalance = playerBalance
    ? parseFloat(formatEther(playerBalance)).toFixed(4)
    : '0.0000';

  const handleDeposit = () => {
    writeContract({
      address: CASINO_ADDRESS,
      abi: CASINO_ABI,
      functionName: 'deposit',
      value: parseEther(depositAmount),
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              zIndex: 200,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="deposit-modal-panel"
            style={{
              background: '#1E1E1E',
              border: '1px solid rgba(244, 197, 66, 0.4)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6)',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#7D7D7D',
                fontSize: '20px',
                cursor: 'pointer',
                lineHeight: 1,
              }}
              aria-label="Close"
            >
              ×
            </button>

            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#F4C542', marginBottom: '4px' }}>
              👑 VIP Club Deposit
            </h2>
            <p style={{ fontSize: '14px', color: '#7D7D7D', marginBottom: '24px' }}>
              Top up your casino balance on Sepolia testnet
            </p>

            {!isConnected ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <p style={{ fontSize: '14px', color: '#7D7D7D', marginBottom: '20px' }}>
                  Connect your wallet to deposit
                </p>
                <ConnectButton />
              </div>
            ) : (
              <>
                <div
                  style={{
                    background: '#2A2A2A',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '13px', color: '#7D7D7D' }}>Casino balance</span>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-gold)' }}>
                    {formattedBalance} ETH
                  </span>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', color: '#7D7D7D', marginBottom: '10px' }}>Quick amounts</div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    {['0.005', '0.01', '0.02', '0.05'].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setDepositAmount(amount)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '10px',
                          border: depositAmount === amount ? '1px solid #F4C542' : '1px solid #2A2A2A',
                          background: depositAmount === amount ? 'rgba(244, 197, 66, 0.12)' : '#2A2A2A',
                          color: depositAmount === amount ? '#F4C542' : '#7D7D7D',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Custom amount"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: '1px solid #2A2A2A',
                      background: '#2A2A2A',
                      color: '#fff',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {txSuccess && (
                  <div
                    style={{
                      marginBottom: '16px',
                      padding: '12px',
                      background: 'rgba(61, 220, 132, 0.1)',
                      borderRadius: '10px',
                      color: 'var(--color-live)',
                      fontSize: '13px',
                      textAlign: 'center',
                    }}
                  >
                    ✓ Deposit confirmed! Balance: {formattedBalance} ETH
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleDeposit}
                  disabled={isPending || txSuccess}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '14px',
                    border: 'none',
                    background:
                      isPending || txSuccess
                        ? '#2A2A2A'
                        : 'linear-gradient(135deg, #F4C542, #c9a020)',
                    color: isPending || txSuccess ? '#7D7D7D' : '#121212',
                    fontSize: '16px',
                    fontWeight: '800',
                    cursor: isPending || txSuccess ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isPending
                    ? '⏳ Confirm in MetaMask...'
                    : txSuccess
                      ? 'Deposited'
                      : `Deposit ${depositAmount} ETH`}
                </button>

                <p style={{ fontSize: '12px', color: '#7D7D7D', marginTop: '16px', textAlign: 'center' }}>
                  Funds are held in the smart contract on Sepolia
                </p>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
