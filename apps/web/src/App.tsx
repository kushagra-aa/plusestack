import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import { useAuth } from './store/useAuth';
import { NotificationBell } from './features/notifications/NotificationBell';
import { useAuthActions } from './hooks/auth/useAuthActions';
import { Button } from './components/ui/button';
import { LogOut } from 'lucide-react';
import { PublishNotificationCard } from './features/notifications/PublishNotificationCard';
import { cn } from './lib/utils';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = useAuth((state) => state.token);
    if (!token) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { logout } = useAuthActions();
    const user = useAuth((state) => state.user);

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
                <div className="container flex h-16 items-center justify-between py-4 max-w-7xl mx-auto px-4">
                    <div className="font-bold text-xl text-primary">PulseStack</div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden sm:inline-block">
                            {user?.email}
                        </span>
                        <NotificationBell />
                        <Button variant="ghost" size="icon" onClick={logout}>
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>
            <main className="container max-w-7xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};

function App() {
    const workspace = useAuth((state) => state.workspace);
    const isAdmin = workspace?.role === 'owner' || workspace?.role === 'admin';

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                                    <p className="text-muted-foreground">
                                        Welcome to your PulseStack dashboard.
                                    </p>
                                </div>
                                <div className={cn(
                                    "grid gap-6",
                                    isAdmin ? "md:grid-cols-2" : "max-w-md mx-auto"
                                )}>
                                    {isAdmin && <PublishNotificationCard />}
                                    <div className="p-6 bg-white rounded-xl border shadow-sm space-y-2">
                                        <h3 className="font-semibold">Quick Start</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Start by exploring your notifications bell on the top right.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default App;
