import { Notification } from './notification.service';
import { formatDistanceToNow } from 'date-fns';
import { Check, Trash2, Info, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
    notification: Notification;
    onMarkRead: (id: string) => void;
    onDelete: (id: string) => void;
}

const iconMap = {
    info: <Info className="h-4 w-4 text-blue-500" />,
    success: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    error: <AlertCircle className="h-4 w-4 text-red-500" />,
};

export function NotificationItem({ notification, onMarkRead, onDelete }: NotificationItemProps) {
    return (
        <div
            className={cn(
                "p-4 border-b last:border-0 transition-colors hover:bg-slate-50 relative group",
                !notification.isRead && "bg-slate-50/50"
            )}
        >
            <div className="flex gap-3">
                <div className="mt-1">{iconMap[notification.type]}</div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                        <h4 className={cn("text-sm font-semibold truncate", !notification.isRead && "text-primary")}>
                            {notification.title}
                        </h4>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {notification.message}
                    </p>
                    <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => onMarkRead(notification.id)}
                            >
                                <Check className="h-3 w-3 mr-1" />
                                Mark read
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                            onClick={() => onDelete(notification.id)}
                        >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
            {!notification.isRead && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
            )}
        </div>
    );
}
