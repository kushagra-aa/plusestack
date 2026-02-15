import { useEffect, useState } from 'react';
import { socketClient } from '@/lib/socket';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    createdAt: number;
}

export function Notifications() {
    const { isAuthenticated } = useAuthStore();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;

        const handleNewNotification = (data: Notification) => {
            console.log('New notification:', data);
            setNotifications((prev) => [data, ...prev]);
            // Optimistic update or wait for unreadCount event
            setUnreadCount((prev) => prev + 1);
        };

        const handleUnreadCount = (data: { unreadCount: number }) => {
            console.log('Unread count updated:', data);
            setUnreadCount(data.unreadCount);
        };

        socketClient.on('notification:new', handleNewNotification);
        socketClient.on('notification:unreadCount', handleUnreadCount);

        return () => {
            socketClient.off('notification:new');
            socketClient.off('notification:unreadCount');
        };
    }, [isAuthenticated]);

    if (!isAuthenticated) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="relative">
                <Button
                    variant="default"
                    size="icon"
                    className="rounded-full w-12 h-12 shadow-lg"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </Button>

                {isOpen && (
                    <Card className="absolute bottom-16 right-0 w-80 shadow-xl max-h-96 overflow-y-auto">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Notifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {notifications.length === 0 ? (
                                <p className="text-muted-foreground text-sm py-4 text-center">
                                    No new notifications
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {notifications.map((n) => (
                                        <div key={n.id} className="bg-muted/50 p-3 rounded-md text-sm">
                                            <p className="font-semibold text-foreground">{n.title}</p>
                                            <p className="text-muted-foreground">{n.message}</p>
                                            <p className="text-xs text-muted-foreground mt-1 opacity-70">
                                                {new Date(n.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
