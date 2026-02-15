import { create } from 'zustand';

interface AuthState {
    user: null | { id: string; email: string; role: string };
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: AuthState['user']) => void;
    logout: () => void;
}

import { socketClient } from '@/lib/socket';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    login: (token, user) => {
        socketClient.connect(token);
        set({ token, user, isAuthenticated: true });
    },
    logout: () => {
        socketClient.disconnect();
        set({ token: null, user: null, isAuthenticated: false });
    },
}));
