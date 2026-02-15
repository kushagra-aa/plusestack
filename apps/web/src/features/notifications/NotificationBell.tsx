import { Bell } from 'lucide-react';
import { useNotifications } from './useNotifications';
import { NotificationList } from './NotificationList';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotificationStore } from './notificationStore';

export function NotificationBell() {
    useNotifications(10); // Still call to initiate fetching and sync unreadCount
    const unreadCount = useNotificationStore((state) => state.unreadCount);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground rounded-full border-2 border-background"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[350px] p-0">
                <div className="p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    <p className="text-xs text-muted-foreground">
                        You have {unreadCount} unread messages
                    </p>
                </div>
                <NotificationList />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Add a dummy DropdownMenuHeader if missing
if (!(DropdownMenu as any).Header) {
    (DropdownMenu as any).Header = ({ children, className }: any) => (
        <div className={`px-2 py-1.5 text-sm font-semibold ${className}`}>{children}</div>
    )
}
