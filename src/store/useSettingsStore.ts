import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  notifEnabled: boolean;
  notifTime: string;
  notifFrequency: string;
  setNotifEnabled: (enabled: boolean) => void;
  setNotifTime: (time: string) => void;
  setNotifFrequency: (freq: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notifEnabled: true,
      notifTime: '19:00',
      notifFrequency: 'daily',
      setNotifEnabled: (notifEnabled) => set({ notifEnabled }),
      setNotifTime: (notifTime) => set({ notifTime }),
      setNotifFrequency: (notifFrequency) => set({ notifFrequency }),
    }),
    {
      name: 'cfi-settings',
    }
  )
);
