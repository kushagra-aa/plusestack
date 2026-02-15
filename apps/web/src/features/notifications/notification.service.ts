import { api } from '../../api/axios';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    createdAt: number;
}

export interface NotificationResponse {
    data: Notification[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    unreadCount: number;
}

export const notificationService = {
    getNotifications: async (page = 1, limit = 10, filter: 'unread' | 'all' = 'all') => {
        const response = await api.get<NotificationResponse>('/notifications', {
            params: { page, limit, filter },
        });
        return response.data;
    },

    markAsRead: async (id: string) => {
        const response = await api.patch(`/notifications/${id}/read`);
        return response.data;
    },

    deleteNotification: async (id: string) => {
        const response = await api.delete(`/notifications/${id}`);
        return response.data;
    },

    createNotification: async (data: {
        title: string;
        message: string;
        type: 'info' | 'success' | 'warning' | 'error' | 'system';
        broadcast: boolean;
        targetUserId?: string;
    }) => {
        const response = await api.post('/notifications', data);
        return response.data;
    },
};
