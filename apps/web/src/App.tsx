import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Rocket, Zap, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Notifications } from '@/components/Notifications';

function App() {
    const { isAuthenticated, login, logout, user } = useAuthStore();

    const handleLogin = async () => {
        const email = 'test@example.com';
        const password = 'password123';

        try {
            const response = await fetch('http://localhost:4000/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            let data = await response.json();

            if (!response.ok) {
                // If login failed, try signup/create
                if (response.status === 401 || response.status === 404 || data.error === 'Invalid credentials') {
                    console.log('Login failed, trying signup...');
                    const signupResponse = await fetch('http://localhost:4000/api/v1/auth/signup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });

                    if (!signupResponse.ok) {
                        alert('Login and Signup failed');
                        return;
                    }
                    data = await signupResponse.json();
                } else {
                    alert('Login failed: ' + data.error);
                    return;
                }
            }

            login(data.token, {
                id: data.user.id,
                email: data.user.email,
                role: data.user.systemRole
            });

        } catch (error) {
            console.error('Auth error:', error);
            alert('Authentication error');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            <Notifications />

            <div className="container mx-auto px-4 py-8 flex justify-end">
                {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">Logged in as {user?.email}</span>
                        <Button variant="outline" onClick={logout}>Logout</Button>
                    </div>
                ) : (
                    <Button onClick={handleLogin}>Simulate Login</Button>
                )}
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center mb-4">
                            <Rocket className="h-12 w-12 text-primary mr-3" />
                            <h1 className="text-5xl font-bold text-foreground">
                                PulseStack
                            </h1>
                        </div>
                        <p className="text-xl text-muted-foreground mb-6">
                            Real-time notification infrastructure system
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button size="lg">Get Started</Button>
                            <Button size="lg" variant="outline">
                                Learn More
                            </Button>
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <Card>
                            <CardHeader>
                                <Zap className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Lightning Fast</CardTitle>
                                <CardDescription>
                                    Built with performance in mind
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Real-time notifications delivered instantly with Socket.io
                                    and optimized backend infrastructure.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Shield className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Secure & Reliable</CardTitle>
                                <CardDescription>
                                    Enterprise-grade security
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    JWT authentication, role-based access control, and encrypted
                                    communications keep your data safe.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Rocket className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Scalable</CardTitle>
                                <CardDescription>
                                    Grows with your needs
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Microservice-ready architecture with shared packages for
                                    future SaaS expansion.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Getting Started Card */}
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Ready to Build</CardTitle>
                            <CardDescription>
                                Your monorepo infrastructure is set up and ready
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p className="text-sm">
                                    ✅ Tailwind CSS v4.1 with ShadCN components
                                </p>
                                <p className="text-sm">✅ TypeScript strict mode enabled</p>
                                <p className="text-sm">✅ Express API with Socket.io</p>
                                <p className="text-sm">✅ React with Zustand & Tanstack Query</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" className="w-full">
                                View Documentation
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default App;
