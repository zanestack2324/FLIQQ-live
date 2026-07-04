import { create } from 'zustand'

type Transaction = {
  id: string
  type: string
  amount: number
  coinAmount: number | null
  diamondAmount: number | null
  status: string
  description: string | null
  createdAt: string
}

type WalletState = {
  coinBalance: number
  diamondBalance: number
  bonusBalance: number
  totalEarned: number
  totalSpent: number
  transactions: Transaction[]
  isLoading: boolean
  setWallet: (data: {
    coinBalance: number
    diamondBalance: number
    bonusBalance: number
    totalEarned: number
    totalSpent: number
  }) => void
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  setLoading: (loading: boolean) => void
  updateBalance: (coins: number, diamonds: number) => void
}

export const useWalletStore = create<WalletState>()((set) => ({
  coinBalance: 0,
  diamondBalance: 0,
  bonusBalance: 0,
  totalEarned: 0,
  totalSpent: 0,
  transactions: [],
  isLoading: true,
  setWallet: (data) => set({ ...data, isLoading: false }),
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
  setLoading: (isLoading) => set({ isLoading }),
  updateBalance: (coins, diamonds) =>
    set((state) => ({
      coinBalance: coins,
      diamondBalance: diamonds,
    })),
}))
