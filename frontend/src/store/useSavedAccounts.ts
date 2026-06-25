import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ResearchResponse } from '../services/research';

interface SavedAccountsState {
  accounts: ResearchResponse[];
  addAccount: (account: ResearchResponse) => void;
  removeAccount: (companyName: string) => void;
  clearAccounts: () => void;
}

export const useSavedAccounts = create<SavedAccountsState>()(
  persist(
    (set) => ({
      accounts: [],
      addAccount: (newAccount) => set((state) => {
        // Remove existing account with the same company name to prevent duplicates
        const filtered = state.accounts.filter(a => a.company !== newAccount.company);
        
        // Add new account to the top and limit to 15 items
        const updated = [newAccount, ...filtered].slice(0, 15);
        
        return { accounts: updated };
      }),
      removeAccount: (companyName) => set((state) => ({
        accounts: state.accounts.filter(a => a.company !== companyName)
      })),
      clearAccounts: () => set({ accounts: [] })
    }),
    {
      name: 'saved-accounts-storage',
    }
  )
);
