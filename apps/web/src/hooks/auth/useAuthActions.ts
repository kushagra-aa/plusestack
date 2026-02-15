import { api } from '../../api/axios';
import { useAuth } from '../../store/useAuth';
import { useMutationWrapper } from '../api/useMutationWrapper';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { socketClient } from '../../lib/socket';
import { useEffect } from 'react';

export const useAuthActions = () => {
    const { setAuth, clearAuth, token } = useAuth((state) => ({
        setAuth: state.setAuth,
        clearAuth: state.clearAuth,
        token: state.token,
    }));
    const navigate = useNavigate();

    // Auto-connect socket if token exists on load
    useEffect(() => {
        if (token) {
            socketClient.connect(token);
        } else {
            socketClient.disconnect();
        }
    }, [token]);

    const loginMutation = useMutationWrapper(
        async (data: any) => {
            const response = await api.post('/auth/login', data);
            return response.data;
        },
        {
            onSuccess: (data) => {
                setAuth(data.user, data.token, data.workspace);
                socketClient.connect(data.token);
                toast({ title: 'Success', description: 'Logged in successfully' });
                navigate('/dashboard');
            },
        }
    );

    const signupMutation = useMutationWrapper(
        async (data: any) => {
            const response = await api.post('/auth/signup', data);
            return response.data;
        },
        {
            onSuccess: (data) => {
                setAuth(data.user, data.token, data.workspace);
                socketClient.connect(data.token);
                toast({ title: 'Success', description: 'Account created successfully' });
                navigate('/dashboard');
            },
        }
    );

    const logout = () => {
        socketClient.disconnect();
        clearAuth();
        navigate('/login');
    };

    return {
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        signup: signupMutation.mutate,
        isSigningUp: signupMutation.isPending,
        logout,
    };
};
