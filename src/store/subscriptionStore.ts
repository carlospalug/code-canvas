import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Capacitor } from '@capacitor/core';

interface SubscriptionState {
  isSubscribed: boolean;
  setSubscribed: (value: boolean) => void;
  subscribe: (plan: 'monthly' | 'yearly') => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      isSubscribed: false,
      setSubscribed: (value) => set({ isSubscribed: value }),
      subscribe: async (plan) => {
        if (Capacitor.getPlatform() === 'android') {
          const { Billing } = Capacitor.Plugins;
          
          // Register listeners
          Billing.addListener('purchaseComplete', (info: any) => {
            if (info.success) {
              set({ isSubscribed: true });
            }
          });

          Billing.addListener('subscriptionStatusChanged', (info: any) => {
            set({ isSubscribed: info.isActive });
          });

          // Initiate purchase
          await Billing.subscribe({ plan });
        }
      }
    }),
    {
      name: 'subscription-storage',
    }
  )
);