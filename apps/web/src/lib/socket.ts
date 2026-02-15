import { io, Socket } from 'socket.io-client';
import { queryClient } from './queryClient';
import { toast } from '@/components/ui/use-toast';
import { useNotificationStore } from '../features/notifications/notificationStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

class SocketClient {
    private socket: Socket | null = null;

    connect(token: string) {
        if (this.socket?.connected) return;

        // Note: Using the /notifications namespace as required by the backend
        this.socket = io(`${SOCKET_URL}/notifications`, {
            auth: { token },
            transports: ['websocket'],
            autoConnect: true,
        });

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket?.id);
        });

        this.socket.on('notification:new', (notification) => {
            console.log('New notification received:', notification);
            toast({
                title: notification.title,
                description: notification.message,
            });

            // 1. Update React Query Cache for all notification filters
            queryClient.setQueriesData({ queryKey: ['notifications'] }, (old: any) => {
                if (!old) return old;

                // Prevent duplicates
                const exists = old.pages.some((page: any) =>
                    page.data.some((n: any) => n.id === notification.id)
                );
                if (exists) return old;

                const newPages = [...old.pages];
                newPages[0] = {
                    ...newPages[0],
                    data: [notification, ...newPages[0].data],
                    unreadCount: (newPages[0].unreadCount || 0) + 1,
                };

                return { ...old, pages: newPages };
            });

            // 2. Increment unread count in store
            useNotificationStore.getState().incrementUnreadCount();
        });

        this.socket.on('notification:unreadCount', ({ unreadCount }) => {
            console.log('Unread count updated:', unreadCount);
            useNotificationStore.getState().setUnreadCount(unreadCount);
        });

        this.socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    on(event: string, callback: (data: any) => void) {
        if (!this.socket) {
            console.warn('Socket not initialized. Call connect() first.');
            return;
        }
        this.socket.on(event, callback);
    }

    off(event: string) {
        if (!this.socket) return;
        this.socket.off(event);
    }
}

export const socketClient = new SocketClient();
