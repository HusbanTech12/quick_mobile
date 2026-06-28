import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setAvatar: (url: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      setAvatar: (avatar_url) =>
        set((state) => ({
          user: state.user ? { ...state.user, avatar_url } : null,
        })),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'quickstore-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
