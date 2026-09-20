export type TransactionType = 'DEBIT' | 'CREDIT';

export type Transaction = {
  id: string;
  date: string;
  type: TransactionType;
  reference: string;
  description: string;
  amount: number; // positive = credit, negative = debit
};

export type WalletData = {
  availableBalance: number;
  currencySymbol: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  totalTransactions: number;
  transactions: Transaction[];
};
