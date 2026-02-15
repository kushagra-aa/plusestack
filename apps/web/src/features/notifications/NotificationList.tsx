import { useNotifications, useNotificationActions } from './useNotifications';
import { NotificationItem } from './NotificationItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function NotificationList() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useNotifications(10);
    const { markAsRead, deleteNotification } = useNotificationActions();

    if (isLoading && !data) {
        return (
            <div className="p-8 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const notifications = data?.pages.flatMap((page) => page.data) || [];

    return (
        <div className="flex flex-col h-[400px]">
            <ScrollArea className="flex-1">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                        No notifications yet.
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {notifications.map((n) => (
                            <NotificationItem
                                key={n.id}
                                notification={n}
                                onMarkRead={markAsRead}
                                onDelete={deleteNotification}
                            />
                        ))}
                    </div>
                )}
            </ScrollArea>
            {hasNextPage && (
                <div className="p-2 border-t mt-auto">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        {isFetchingNextPage ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                            'Load more'
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
