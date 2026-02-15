import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    systemRole: string;
}

interface Workspace {
    id: string;
    name: string;
    role: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    workspace: Workspace | null;
    setAuth: (user: User, token: string, workspace: Workspace) => void;
    clearAuth: () => void;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            workspace: null,
            setAuth: (user, token, workspace) => set({ user, token, workspace }),
            clearAuth: () => set({ user: null, token: null, workspace: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
