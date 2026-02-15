import { useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService, NotificationResponse } from './notification.service';
import { toast } from '@/components/ui/use-toast';
import { useNotificationStore } from './notificationStore';
import { useEffect } from 'react';

export const useNotifications = (limit = 10, filter: 'unread' | 'all' = 'all') => {
    const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

    const query = useInfiniteQuery<NotificationResponse>({
        queryKey: ['notifications', filter],
        queryFn: ({ pageParam = 1 }) => notificationService.getNotifications(pageParam as number, limit, filter),
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination.page < lastPage.pagination.totalPages) {
                return lastPage.pagination.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });

    // Update unread count in store when data changes
    useEffect(() => {
        const firstPageCount = query.data?.pages[0]?.unreadCount;
        if (typeof firstPageCount === 'number') {
            setUnreadCount(firstPageCount);
        }
    }, [query.data?.pages[0]?.unreadCount, setUnreadCount]);

    return query;
};

export const useNotificationActions = () => {
    const queryClient = useQueryClient();
    const decrementUnreadCount = useNotificationStore((state) => state.decrementUnreadCount);

    const markReadMutation = useMutation({
        mutationFn: (id: string) => notificationService.markAsRead(id),
        onSuccess: (_, id) => {
            // Update all notification queries (all, unread, etc)
            queryClient.setQueriesData({ queryKey: ['notifications'] }, (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        data: page.data.map((n: any) =>
                            n.id === id ? { ...n, isRead: true } : n
                        ),
                        unreadCount: Math.max(0, page.unreadCount - 1),
                    })),
                };
            });
            decrementUnreadCount();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => notificationService.deleteNotification(id),
        onSuccess: (_, id) => {
            // Update all notification queries
            queryClient.setQueriesData({ queryKey: ['notifications'] }, (old: any) => {
                if (!old) return old;

                let wasUnread = false;
                const newPages = old.pages.map((page: any) => {
                    const filteredData = page.data.filter((n: any) => {
                        if (n.id === id) {
                            if (!n.isRead) wasUnread = true;
                            return false;
                        }
                        return true;
                    });
                    return { ...page, data: filteredData };
                });

                if (wasUnread) decrementUnreadCount();

                return {
                    ...old,
                    pages: newPages.map((page: any) => ({
                        ...page,
                        unreadCount: wasUnread ? Math.max(0, page.unreadCount - 1) : page.unreadCount
                    })),
                };
            });
            toast({ title: 'Success', description: 'Notification deleted' });
        },
    });

    return {
        markAsRead: markReadMutation.mutate,
        isMarkingRead: markReadMutation.isPending,
        deleteNotification: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
};
