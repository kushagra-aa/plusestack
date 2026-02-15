import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { notificationService } from './notification.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
    type: z.enum(['info', 'success', 'warning', 'error', 'system']),
    broadcast: z.boolean(),
    targetUserId: z.string().optional(),
}).refine((data) => {
    if (!data.broadcast && !data.targetUserId) {
        return false;
    }
    return true;
}, {
    message: "Target User ID is required if not broadcasting",
    path: ["targetUserId"],
});

type FormValues = z.infer<typeof formSchema>;

export function PublishNotificationCard() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            message: '',
            type: 'info',
            broadcast: true,
            targetUserId: '',
        },
    });

    const mutation = useMutation({
        mutationFn: (values: FormValues) => notificationService.createNotification(values),
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Notification sent successfully',
            });
            form.reset();
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to send notification',
                variant: 'destructive',
            });
        },
    });

    const onSubmit: SubmitHandler<FormValues> = (values) => {
        mutation.mutate(values);
    };

    const isBroadcast = form.watch('broadcast');

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Publish Notification</CardTitle>
                <CardDescription>
                    Send a real-time notification to workspace members.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., System Update" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Describe the notification..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="info">Info</option>
                                                <option value="success">Success</option>
                                                <option value="warning">Warning</option>
                                                <option value="error">Error</option>
                                                <option value="system">System</option>
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="broadcast"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-end space-x-3 space-y-0 py-2">
                                        <FormControl>
                                            <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={field.onChange}
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Broadcast to all</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {!isBroadcast && (
                            <FormField
                                control={form.control}
                                name="targetUserId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Target User ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter User UUID" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <Button type="submit" className="w-full" disabled={mutation.isPending}>
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Publish Notification
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
