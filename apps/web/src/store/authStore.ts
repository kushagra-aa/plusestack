import { create } from 'zustand';

interface AuthState {
    user: null | { id: string; email: string; role: string };
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: AuthState['user']) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    login: (token, user) => set({ token, user, isAuthenticated: true }),
    logout: () => set({ token: null, user: null, isAuthenticated: false }),
}));
