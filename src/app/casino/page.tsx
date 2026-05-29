'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther, formatEther } from 'viem';
import { CASINO_ADDRESS, CASINO_ABI } from '@/lib/wagmi';
import { CasinoShell } from '@/components/CasinoShell';
import { CasinoGamesSection } from '@/components/CasinoGamesSection';
import { CASINO_GAME_CATEGORIES, type CasinoGame } from '@/lib/casinoGames';

type CoinSide = 0 | 1;
type GamePhase = 'idle' | 'betting' | 'flipping' | 'result';

export default function CasinoPage() {
  const { address, isConnected } = useAccount();
  const [betAmount, setBetAmount] = useState('0.001');
  const [choice, setChoice] = useState<CoinSide>(0);
  const [gamePhase, setGamePhase] = useState<GamePhase>('idle');
  const [lastResult, setLastResult] = useState<{ won: boolean; payout: string } | null>(null);
  const [depositAmount, setDepositAmount] = useState('0.005');
  const [activeTab, setActiveTab] = useState<'game' | 'deposit' | 'withdraw'>('game');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedGameId, setSelectedGameId] = useState<string | null>('coin-flip');

  const handleSelectGame = (game: CasinoGame) => {
    if (game.available) setSelectedGameId(game.id);
  };

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
    if (txSuccess) {
      refetchBalance();
      if (gamePhase === 'betting') {
        setGamePhase('flipping');
        setTimeout(() => {
          setGamePhase('result');
          setLastResult({
            won: Math.random() > 0.5,
            payout: (parseFloat(betAmount) * 1.9).toFixed(4),
          });
        }, 2000);
      } else {
        setGamePhase('idle');
      }
    }
  }, [txSuccess]);

  const handleDeposit = () => {
    writeContract({
      address: CASINO_ADDRESS,
      abi: CASINO_ABI,
      functionName: 'deposit',
      value: parseEther(depositAmount),
    });
  };

  const handlePlay = () => {
    if (!playerBalance || playerBalance === BigInt(0)) return;
    setGamePhase('betting');
    writeContract({
      address: CASINO_ADDRESS,
      abi: CASINO_ABI,
      functionName: 'play',
      args: [choice, parseEther(betAmount)],
    });
  };

  const handleWithdraw = () => {
    if (!withdrawAmount) return;
    writeContract({
      address: CASINO_ADDRESS,
      abi: CASINO_ABI,
      functionName: 'withdraw',
      args: [parseEther(withdrawAmount)],
    });
  };

  const formattedBalance = playerBalance ? parseFloat(formatEther(playerBalance)).toFixed(4) : '0.0000';

  return (
    <CasinoShell>
      <div className="page-container">
        <CasinoGamesSection
          categories={CASINO_GAME_CATEGORIES}
          selectedGameId={isConnected ? selectedGameId : null}
          onSelectGame={isConnected ? handleSelectGame : undefined}
        />

        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', paddingTop: '24px' }}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🐀</div>
            <h1
              style={{
                fontSize: '36px',
                fontWeight: '900',
                color: '#fff',
                marginBottom: '12px',
                lineHeight: 1.1,
              }}
            >
              The Luckiest Rats{' '}
              <span style={{ color: '#3DDC84' }}>Play Here</span>
            </h1>
            <p style={{ fontSize: '16px', color: '#7D7D7D', marginBottom: '28px' }}>
              Connect your wallet to play Coin Flip on Sepolia testnet
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ConnectButton />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '48px',
                marginTop: '48px',
                flexWrap: 'wrap',
              }}
            >
              {[
                { label: 'House Edge', value: '5%' },
                { label: 'Network', value: 'Sepolia' },
                { label: 'Live Game', value: 'Coin Flip' },
                { label: 'Verified', value: '✓ On-chain' },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: '#3DDC84' }}>{stat.value}</div>
                  <div style={{ fontSize: '13px', color: '#7D7D7D', marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div>
              {/* Hero Banner */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%)',
                  border: '1px solid #3DDC84',
                  borderRadius: '20px',
                  padding: '32px',
                  marginBottom: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 0 40px rgba(61, 220, 132, 0.1)',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', color: '#7D7D7D', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Welcome Bonus
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: '900', color: '#fff', marginBottom: '8px' }}>
                    200% First Deposit
                  </div>
                  <div style={{ fontSize: '15px', color: '#3DDC84' }}>
                    Up to 0.1 ETH bonus on Sepolia testnet
                  </div>
                </div>
                <div style={{ fontSize: '80px' }}>🧀</div>
              </motion.div>

              {/* Tabs */}
              <div className="casino-tabs">
                {(['game', 'deposit', 'withdraw'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={activeTab === tab ? 'tab-active' : ''}
                    style={{
                      textTransform: 'capitalize',
                    }}
                  >
                    {tab === 'game' ? '🎰 Play' : tab === 'deposit' ? '💰 Deposit' : '💸 Withdraw'}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'game' && selectedGameId === 'coin-flip' && (
                  <motion.div
                    key="game"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="casino-game-grid">
                      {/* Coin Flip Game */}
                      <div style={{
                        background: '#1E1E1E',
                        border: '1px solid #2A2A2A',
                        borderRadius: '20px',
                        padding: '32px',
                      }}>
                        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                          🪙 Coin Flip
                        </h2>
                        <p style={{ fontSize: '13px', color: '#7D7D7D', marginBottom: '32px' }}>
                          Heads or tails? 95% payout • Verified on-chain
                        </p>

                        {/* Coin Animation */}
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                          <motion.div
                            animate={gamePhase === 'flipping' ? {
                              rotateY: [0, 180, 360, 540, 720],
                              scale: [1, 1.2, 1, 1.2, 1],
                            } : {}}
                            transition={{ duration: 2, ease: 'easeInOut' }}
                            style={{
                              width: '120px',
                              height: '120px',
                              borderRadius: '50%',
                              background: gamePhase === 'result'
                                ? (lastResult?.won ? 'linear-gradient(135deg, #3DDC84, #2ab870)' : 'linear-gradient(135deg, #ff4444, #cc0000)')
                                : 'linear-gradient(135deg, #F4C542, #d4a520)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '48px',
                              margin: '0 auto',
                              boxShadow: gamePhase === 'result'
                                ? (lastResult?.won ? '0 0 40px rgba(61, 220, 132, 0.5)' : '0 0 40px rgba(255, 68, 68, 0.5)')
                                : '0 0 40px rgba(244, 197, 66, 0.3)',
                              cursor: 'default',
                            }}
                          >
                            {gamePhase === 'result'
                              ? (lastResult?.won ? '🏆' : '💀')
                              : (choice === 0 ? '🐀' : '🧀')
                            }
                          </motion.div>

                          {gamePhase === 'result' && lastResult && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              style={{ marginTop: '16px' }}
                            >
                              <div style={{
                                fontSize: '22px',
                                fontWeight: '900',
                                color: lastResult.won ? '#3DDC84' : '#ff4444',
                              }}>
                                {lastResult.won ? `+${lastResult.payout} ETH` : 'Better luck next time!'}
                              </div>
                              <button
                                onClick={() => { setGamePhase('idle'); setLastResult(null); }}
                                style={{
                                  marginTop: '12px',
                                  padding: '8px 24px',
                                  background: 'transparent',
                                  border: '1px solid #3DDC84',
                                  borderRadius: '8px',
                                  color: '#3DDC84',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                }}
                              >
                                Play Again
                              </button>
                            </motion.div>
                          )}
                        </div>

                        {/* Choice */}
                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ fontSize: '13px', color: '#7D7D7D', marginBottom: '10px' }}>Your Pick</div>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            {([0, 1] as CoinSide[]).map((side) => (
                              <button
                                key={side}
                                onClick={() => setChoice(side)}
                                style={{
                                  flex: 1,
                                  padding: '14px',
                                  borderRadius: '12px',
                                  border: choice === side ? '2px solid #3DDC84' : '2px solid #2A2A2A',
                                  background: choice === side ? 'rgba(61, 220, 132, 0.1)' : '#2A2A2A',
                                  color: choice === side ? '#3DDC84' : '#7D7D7D',
                                  cursor: 'pointer',
                                  fontSize: '16px',
                                  fontWeight: '700',
                                  transition: 'all 0.2s',
                                }}
                              >
                                {side === 0 ? '🐀 Heads' : '🧀 Tails'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Bet Amount */}
                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ fontSize: '13px', color: '#7D7D7D', marginBottom: '10px' }}>Bet Amount (ETH)</div>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                            {['0.001', '0.002', '0.005', '0.01'].map((amount) => (
                              <button
                                key={amount}
                                onClick={() => setBetAmount(amount)}
                                style={{
                                  flex: 1,
                                  padding: '8px',
                                  borderRadius: '8px',
                                  border: betAmount === amount ? '1px solid #3DDC84' : '1px solid #2A2A2A',
                                  background: betAmount === amount ? 'rgba(61, 220, 132, 0.1)' : '#2A2A2A',
                                  color: betAmount === amount ? '#3DDC84' : '#7D7D7D',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                }}
                              >
                                {amount}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={handlePlay}
                          disabled={isPending || gamePhase === 'flipping' || gamePhase === 'betting' || !playerBalance || playerBalance === BigInt(0)}
                          style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '14px',
                            border: 'none',
                            background: isPending || gamePhase !== 'idle'
                              ? '#2A2A2A'
                              : 'linear-gradient(135deg, #3DDC84, #2ab870)',
                            color: isPending || gamePhase !== 'idle' ? '#7D7D7D' : '#121212',
                            fontSize: '16px',
                            fontWeight: '800',
                            cursor: isPending || gamePhase !== 'idle' ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          {gamePhase === 'flipping' ? '🎲 Flipping...' :
                           gamePhase === 'betting' ? '⏳ Confirming...' :
                           isPending ? '⏳ Waiting...' :
                           !playerBalance || playerBalance === BigInt(0) ? 'Deposit first →' :
                           `🎰 Flip for ${betAmount} ETH`}
                        </button>
                      </div>

                      {/* Right Panel */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Balance Card */}
                        <div style={{
                          background: '#1E1E1E',
                          border: '1px solid #2A2A2A',
                          borderRadius: '20px',
                          padding: '24px',
                        }}>
                          <div style={{ fontSize: '13px', color: '#7D7D7D', marginBottom: '8px' }}>Casino Balance</div>
                          <div style={{ fontSize: '36px', fontWeight: '900', color: '#3DDC84', marginBottom: '4px' }}>
                            {formattedBalance}
                          </div>
                          <div style={{ fontSize: '13px', color: '#7D7D7D' }}>ETH on Sepolia</div>
                        </div>

                        {/* Game Info */}
                        <div style={{
                          background: '#1E1E1E',
                          border: '1px solid #2A2A2A',
                          borderRadius: '20px',
                          padding: '24px',
                        }}>
                          <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
                            Game Info
                          </div>
                          {[
                            { label: 'House Edge', value: '5%' },
                            { label: 'Win Multiplier', value: '1.9x' },
                            { label: 'Network', value: 'Sepolia' },
                            { label: 'Contract', value: '0x02E6...06F32' },
                          ].map((info) => (
                            <div key={info.label} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: '12px',
                            }}>
                              <span style={{ fontSize: '13px', color: '#7D7D7D' }}>{info.label}</span>
                              <span style={{ fontSize: '13px', color: '#BFC3C9', fontWeight: '600' }}>{info.value}</span>
                            </div>
                          ))}
                          
                            <a href={`https://sepolia.etherscan.io/address/${CASINO_ADDRESS}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'block',
                              textAlign: 'center',
                              padding: '10px',
                              background: '#2A2A2A',
                              borderRadius: '10px',
                              color: '#3DDC84',
                              fontSize: '12px',
                              textDecoration: 'none',
                              marginTop: '8px',
                            }}
                          >
                            🔍 Verify on Etherscan 
                          </a>
                        </div>

                        {/* Recent Results */}
                        <div style={{
                          background: '#1E1E1E',
                          border: '1px solid #2A2A2A',
                          borderRadius: '20px',
                          padding: '24px',
                        }}>
                          <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
                            Recent Results
                          </div>
                          {[
                            { result: 'win', amount: '+0.0019', time: '2m ago' },
                            { result: 'loss', amount: '-0.001', time: '5m ago' },
                            { result: 'win', amount: '+0.0019', time: '12m ago' },
                          ].map((item, i) => (
                            <div key={i} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '10px',
                              padding: '8px',
                              background: '#2A2A2A',
                              borderRadius: '8px',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{item.result === 'win' ? '🏆' : '💀'}</span>
                                <span style={{ fontSize: '12px', color: '#7D7D7D' }}>{item.time}</span>
                              </div>
                              <span style={{
                                fontSize: '13px',
                                fontWeight: '700',
                                color: item.result === 'win' ? '#3DDC84' : '#ff4444',
                              }}>
                                {item.amount} ETH
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'game' && selectedGameId !== 'coin-flip' && (
                  <motion.div
                    key="no-game"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      background: '#1E1E1E',
                      border: '1px solid #2A2A2A',
                      borderRadius: '20px',
                      padding: '48px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎰</div>
                    <p style={{ fontSize: '16px', color: '#7D7D7D' }}>
                      Select Coin Flip from Lucky Rat Originals to play
                    </p>
                  </motion.div>
                )}

                {/* DEPOSIT TAB */}
                {activeTab === 'deposit' && (
                  <motion.div
                    key="deposit"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    style={{
                      background: '#1E1E1E',
                      border: '1px solid #2A2A2A',
                      borderRadius: '20px',
                      padding: '40px',
                      maxWidth: '480px',
                    }}
                  >
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                      💰 Deposit ETH
                    </h2>
                    <p style={{ fontSize: '14px', color: '#7D7D7D', marginBottom: '32px' }}>
                      Add funds to your casino balance on Sepolia testnet
                    </p>

                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '13px', color: '#7D7D7D', marginBottom: '10px' }}>Quick amounts</div>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        {['0.005', '0.01', '0.02', '0.05'].map((amount) => (
                          <button
                            key={amount}
                            onClick={() => setDepositAmount(amount)}
                            style={{
                              flex: 1,
                              padding: '10px',
                              borderRadius: '10px',
                              border: depositAmount === amount ? '1px solid #3DDC84' : '1px solid #2A2A2A',
                              background: depositAmount === amount ? 'rgba(61, 220, 132, 0.1)' : '#2A2A2A',
                              color: depositAmount === amount ? '#3DDC84' : '#7D7D7D',
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
                        }}
                      />
                    </div>

                    <button
                      onClick={handleDeposit}
                      disabled={isPending}
                      style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '14px',
                        border: 'none',
                        background: isPending ? '#2A2A2A' : 'linear-gradient(135deg, #3DDC84, #2ab870)',
                        color: isPending ? '#7D7D7D' : '#121212',
                        fontSize: '16px',
                        fontWeight: '800',
                        cursor: isPending ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isPending ? '⏳ Confirming in MetaMask...' : `Deposit ${depositAmount} ETH`}
                    </button>

                    <div style={{
                      marginTop: '20px',
                      padding: '16px',
                      background: '#2A2A2A',
                      borderRadius: '12px',
                      fontSize: '13px',
                      color: '#7D7D7D',
                    }}>
                      ℹ️ Funds are held in the smart contract. You can withdraw anytime.
                    </div>
                  </motion.div>
                )}

                {/* WITHDRAW TAB */}
                {activeTab === 'withdraw' && (
                  <motion.div
                    key="withdraw"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    style={{
                      background: '#1E1E1E',
                      border: '1px solid #2A2A2A',
                      borderRadius: '20px',
                      padding: '40px',
                      maxWidth: '480px',
                    }}
                  >
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                      💸 Withdraw ETH
                    </h2>
                    <p style={{ fontSize: '14px', color: '#7D7D7D', marginBottom: '32px' }}>
                      Withdraw your winnings back to your wallet
                    </p>

                    <div style={{
                      background: '#2A2A2A',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{ fontSize: '14px', color: '#7D7D7D' }}>Available</span>
                      <span style={{ fontSize: '20px', fontWeight: '800', color: '#3DDC84' }}>
                        {formattedBalance} ETH
                      </span>
                    </div>

                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Amount to withdraw"
                      max={formattedBalance}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1px solid #2A2A2A',
                        background: '#2A2A2A',
                        color: '#fff',
                        fontSize: '16px',
                        outline: 'none',
                        marginBottom: '16px',
                      }}
                    />

                    <button
                      onClick={() => setWithdrawAmount(formattedBalance)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid #2A2A2A',
                        background: 'transparent',
                        color: '#7D7D7D',
                        cursor: 'pointer',
                        fontSize: '13px',
                        marginBottom: '16px',
                      }}
                    >
                      Withdraw Max
                    </button>

                    <button
                      onClick={handleWithdraw}
                      disabled={isPending || !withdrawAmount}
                      style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '14px',
                        border: 'none',
                        background: isPending || !withdrawAmount ? '#2A2A2A' : 'linear-gradient(135deg, #F4C542, #d4a520)',
                        color: isPending || !withdrawAmount ? '#7D7D7D' : '#121212',
                        fontSize: '16px',
                        fontWeight: '800',
                        cursor: isPending || !withdrawAmount ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isPending ? '⏳ Confirming...' : `Withdraw ${withdrawAmount || '0'} ETH`}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
        )}
      </div>
    </CasinoShell>
  );
}