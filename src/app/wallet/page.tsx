'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CasinoShell } from '@/components/CasinoShell';
import { useAuthStore, useToastStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/ui/DataTable';

const COINS = ['BTC', 'ETH', 'USDT'] as const;

export default function WalletPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const loading = useAuthStore((s) => s.loading);
  const toast = useToastStore((s) => s.show);
  const [transactions, setTransactions] = useState<Record<string, unknown>[]>([]);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState('100');
  const [currency, setCurrency] = useState<(typeof COINS)[number]>('USDT');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const loadTx = async () => {
    const res = await fetch('/api/wallet/transactions');
    if (res.ok) {
      const data = await res.json();
      setTransactions(data.transactions ?? []);
    }
  };

  useEffect(() => {
    if (user) void loadTx();
  }, [user]);

  const deposit = async () => {
    const res = await fetch('/api/wallet/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount), currency }),
    });
    const data = await res.json();
    if (!res.ok) return toast(data.error ?? 'Deposit failed', 'error');
    setUser(data.user);
    toast('Deposit successful (demo)', 'success');
    setDepositOpen(false);
    void loadTx();
  };

  const withdraw = async () => {
    const res = await fetch('/api/wallet/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount), currency }),
    });
    const data = await res.json();
    if (!res.ok) return toast(data.error ?? 'Withdraw failed', 'error');
    setUser(data.user);
    toast('Withdrawal processed (demo)', 'success');
    setWithdrawOpen(false);
    void loadTx();
  };

  if (loading || !user) return null;

  return (
    <CasinoShell>
      <div className="page-container lr-wallet">
        <h1>Wallet</h1>
        <div className="lr-wallet-balance lr-card">
          <span>Available Balance</span>
          <strong>${user.balance.toFixed(2)}</strong>
          <div className="lr-wallet-actions">
            <Button onClick={() => setDepositOpen(true)}>Deposit</Button>
            <Button variant="secondary" onClick={() => setWithdrawOpen(true)}>Withdraw</Button>
          </div>
        </div>
        <div className="lr-card lr-card--wide">
          <h3>Transaction History</h3>
          <DataTable
            rows={transactions}
            emptyText="No transactions"
            columns={[
              { key: 'type', label: 'Type' },
              { key: 'currency', label: 'Coin' },
              { key: 'amount', label: 'Amount', render: (r) => Number(r.amount).toFixed(2) },
              { key: 'status', label: 'Status' },
              { key: 'createdAt', label: 'Date', render: (r) => new Date(String(r.createdAt)).toLocaleString() },
            ]}
          />
        </div>

        <Modal open={depositOpen} onClose={() => setDepositOpen(false)} title="Deposit (Demo)">
          <div className="lr-modal-form">
            <label className="lr-field">
              <span className="lr-field-label">Coin</span>
              <select className="lr-input" value={currency} onChange={(e) => setCurrency(e.target.value as typeof currency)}>
                {COINS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <Input label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Button onClick={() => void deposit()}>Confirm Deposit</Button>
          </div>
        </Modal>

        <Modal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} title="Withdraw (Demo)">
          <div className="lr-modal-form">
            <label className="lr-field">
              <span className="lr-field-label">Coin</span>
              <select className="lr-input" value={currency} onChange={(e) => setCurrency(e.target.value as typeof currency)}>
                {COINS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <Input label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Button variant="secondary" onClick={() => void withdraw()}>Confirm Withdraw</Button>
          </div>
        </Modal>
      </div>
    </CasinoShell>
  );
}
