import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminUser } from '@/types';

/**
 * Store de autenticación del panel admin.
 *
 * - `persist` guarda el estado en localStorage → el login sobrevive recargas.
 * - El token se lee desde aquí en el Apollo auth-link, sin prop drilling.
 * - `logout` limpia el estado Y el cliente Apollo (ver App.tsx).
 */
interface AuthState {
  token: string | null;
  user: AdminUser | null;
  setAuth: (token: string, user: AdminUser) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setAuth: (token, user) => set({ token, user }),

      logout: () => set({ token: null, user: null }),

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'admin-auth',
      // Solo persistir token y user, no las funciones
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
