import { useState } from 'react';
import type { WalletData, Transaction, TransactionType } from '../types/wallet';

/* ─── Demo data (replace with API response) ─────────────────────────────── */
const DEMO_WALLET: WalletData = {
  availableBalance: 15500,
  currencySymbol: '₦',
  status: 'ACTIVE',
  totalTransactions: 8,
  transactions: [
    {
      id: 't1',
      date: 'Sep 16, 2026, 01:57 PM',
      type: 'DEBIT',
      reference: 'OLEVEL-FEE-CVP-PN7S2DGJ',
      description: 'Instant WAEC O-Level Result Verification for ExamNo: 4000000001 (2024)',
      amount: -6000,
    },
    {
      id: 't2',
      date: 'Sep 16, 2026, 01:56 PM',
      type: 'DEBIT',
      reference: 'OLEVEL-FEE-CVP-2I3X36E6',
      description: 'Instant WAEC O-Level Result Verification for ExamNo: 4000000001 (2024)',
      amount: -6000,
    },
    {
      id: 't3',
      date: 'Sep 15, 2026, 11:14 PM',
      type: 'DEBIT',
      reference: 'OLEVEL-FEE-CVP-T087G7X8',
      description: 'Instant WAEC O-Level Result Verification for ExamNo: 4041313057 (2012)',
      amount: -6000,
    },
    {
      id: 't4',
      date: 'Sep 10, 2026, 09:00 AM',
      type: 'CREDIT',
      reference: 'TOPUP-CVP-W8392KQP',
      description: 'Wallet top-up via bank transfer',
      amount: 50000,
    },
    {
      id: 't5',
      date: 'Sep 9, 2026, 03:15 PM',
      type: 'DEBIT',
      reference: 'OLEVEL-FEE-CVP-A11Z99QR',
      description: 'Instant NECO O-Level Result Verification for ExamNo: 1029384756 (2023)',
      amount: -6000,
    },
  ],
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function formatCurrency(symbol: string, amount: number): string {
  return `${symbol}${Math.abs(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
}

const typeBadge: Record<TransactionType, string> = {
  DEBIT:  'bg-[rgba(255,85,51,0.12)] text-[#ff5533]',
  CREDIT: 'bg-[rgba(17,155,116,0.12)] text-[#119b74]',
};

const statusBadge: Record<WalletData['status'], string> = {
  ACTIVE:    'bg-[#ff5533] text-white',
  SUSPENDED: 'bg-[#ff9933] text-white',
  INACTIVE:  'bg-[#62646a] text-white',
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {
  onNavigate?: (page: string) => void;
  walletData?: WalletData; // swapped for real API data when backend is ready
};

export default function WalletBalance({ walletData = DEMO_WALLET }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>(walletData.transactions);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    /* backend integration point — GET /api/wallet/transactions */
    await new Promise(r => setTimeout(r, 600));
    setTransactions(walletData.transactions);
    setIsRefreshing(false);
  };

  const handleFundWallet = () => {
    /* backend integration point — POST /api/wallet/fund (opens payment modal) */
  };

  return (
    <div className="flex flex-col gap-4 min-h-full">

      {/* Section Header */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold font-['Urbanist',sans-serif] text-[#38393d] leading-tight">
            Institution Wallet &amp; Balance
          </h2>
          <p className="text-[14px] font-normal font-['Inter',sans-serif] text-[#62646a] mt-1">
            Manage account and transactions.
          </p>
        </div>

        <button
          onClick={handleFundWallet}
          className="flex-shrink-0 bg-[#ff5533] hover:bg-[#e64d2e] transition-colors text-white font-bold font-['Inter',sans-serif] text-[15px] px-6 py-3 rounded-xl shadow-[0px_4px_8px_rgba(211,1,28,0.2)]"
        >
          Fund Wallet
        </button>
      </div>

      {/* Balance + Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Available Balance — dark card */}
        <div className="relative bg-[#0f172b] rounded-xl px-6 py-7 overflow-hidden">
          {/* Subtle radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,85,51,0.18),transparent_60%)] pointer-events-none" />

          <div className="relative flex items-start justify-between gap-2 mb-4">
            <p className="text-[11px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-[0.12em]">
              Available Balance
            </p>
            <span className={`text-[10px] font-bold font-['Urbanist',sans-serif] px-2.5 py-1 rounded-md ${statusBadge[walletData.status]}`}>
              {walletData.status}
            </span>
          </div>

          <p className="relative text-[42px] font-bold font-['Urbanist',sans-serif] text-white leading-none">
            {formatCurrency(walletData.currencySymbol, walletData.availableBalance)}
          </p>
        </div>

        {/* Total Transactions — light card */}
        <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] px-6 py-7 flex flex-col justify-between">
          <p className="text-[11px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-[0.12em] mb-3">
            Total Transactions
          </p>
          <p className="text-[48px] font-semibold font-['Urbanist',sans-serif] text-[#0f172b] leading-none">
            {walletData.totalTransactions}
          </p>
          <p className="text-[13px] font-normal font-['Inter',sans-serif] text-[#62646a] mt-3">
            Credit top-ups &amp; automated service debits
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-[#fafcff] rounded-xl shadow-[0px_4px_10px_#eeeef7] overflow-hidden flex-1">

        {/* Table header row */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#eeeef7]">
          <h3 className="text-[18px] font-bold font-['Urbanist',sans-serif] text-[#0f172b]">
            Transaction History
          </h3>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-[13px] font-medium font-['Inter',sans-serif] text-[#ff5533] hover:opacity-75 transition-opacity"
          >
            <svg
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.13-3.87M20 15a9 9 0 01-14.13 3.87" />
            </svg>
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#eeeef7]">
                {['Date', 'Type', 'Reference', 'Description', 'Amount'].map(col => (
                  <th
                    key={col}
                    className={`px-6 py-3 text-[11px] font-bold font-['Urbanist',sans-serif] text-[#62646a] uppercase tracking-[0.1em] whitespace-nowrap ${
                      col === 'Amount' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeef7]">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[14px] font-['Inter',sans-serif] text-[#62646a]">
                    No transactions yet.
                  </td>
                </tr>
              ) : (
                transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-[#eeeef7]/40 transition-colors">

                    <td className="px-6 py-4 text-[13px] font-normal font-['Inter',sans-serif] text-[#62646a] whitespace-nowrap">
                      {tx.date}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-bold font-['Urbanist',sans-serif] px-3 py-1.5 rounded-lg ${typeBadge[tx.type]}`}>
                        {tx.type}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-[13px] font-semibold font-['Inter',sans-serif] text-[#0f172b] whitespace-nowrap">
                      {tx.reference}
                    </td>

                    <td className="px-6 py-4 text-[13px] font-normal font-['Inter',sans-serif] text-[#4d4f54] max-w-[320px]">
                      <span className="line-clamp-1">{tx.description}</span>
                    </td>

                    <td className={`px-6 py-4 text-[14px] font-bold font-['Inter',sans-serif] text-right whitespace-nowrap ${
                      tx.amount < 0 ? 'text-[#ff5533]' : 'text-[#119b74]'
                    }`}>
                      {tx.amount < 0 ? '-' : '+'}{formatCurrency(walletData.currencySymbol, tx.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-[12px] font-normal font-['Inter',sans-serif] text-[#62646a] py-2">
        © 2026 CVP Portal. All rights reserved.
      </p>
    </div>
  );
}
