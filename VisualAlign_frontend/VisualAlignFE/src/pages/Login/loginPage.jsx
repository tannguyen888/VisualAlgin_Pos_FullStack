import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoAndCurrentTime from '@/components/firstPage/LogoAndCurrentTime';
import { getGoogleOAuthLoginUrl, login } from '@/services/authService';
import { saveAuthSession, getCurrentUserRole, getDefaultRouteByRole } from '@/lib/authSession';

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isCheckoutLogin = location.state?.reason === 'purchase_requires_login';
    const oauthFailed = new URLSearchParams(location.search).get('error') === 'oauth_failed';
    const displayError = error || (oauthFailed ? 'Google login failed. Please try again.' : '');

    useEffect(() => {
        const redirectTo = location.state?.redirectTo;
        const redirectState = location.state?.redirectState;
        const existingRole = getCurrentUserRole();
        if (existingRole) {
            if (existingRole === 'user' && redirectTo) {
                navigate(redirectTo, { state: redirectState, replace: true });
                return;
            }
            navigate(getDefaultRouteByRole(existingRole), { replace: true });
        }
    }, [location.state, navigate]);

    const handleVerifyAndSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Please enter email and password.');
            return;
        }
       
        setIsSubmitting(true);

        try {
            const response = await login(email.trim(), password.trim());
            const session = saveAuthSession(response);
            const redirectTo = location.state?.redirectTo;
            const redirectState = location.state?.redirectState;

            if (session.role === 'user' && redirectTo) {
                navigate(redirectTo, { state: redirectState, replace: true });
                return;
            }

            navigate(getDefaultRouteByRole(session.role), { replace: true });
        } catch (apiError) {
            setError(apiError?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = getGoogleOAuthLoginUrl();
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="p-6">
                <LogoAndCurrentTime />
            </div>

            <div className="px-6 pb-8">
                <div className="min-h-[calc(100vh-9rem)] flex justify-center items-start pt-8">
                    <div className="w-full max-w-md border border-zinc-700 bg-zinc-950/90 rounded-xl p-6 shadow-xl">
                        <h1 className="text-2xl font-bold text-white text-center mb-1">User Login</h1>
                        <p className="text-xs text-zinc-400 text-center mb-5">
                            {isCheckoutLogin ? 'Sign in to continue checkout.' : 'Sign in to access your account and orders.'}
                        </p>

                        <form onSubmit={handleVerifyAndSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="user-email" className="block text-sm text-zinc-200 mb-1">Email</label>
                                <input
                                    id="user-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError('');
                                    }}
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 text-white px-3 py-2 outline-none focus:border-red-500"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="user-password" className="block text-sm text-zinc-200 mb-1">Password</label>
                                <input
                                    id="user-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError('');
                                    }}
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 text-white px-3 py-2 outline-none focus:border-red-500"
                                    placeholder="Enter password"
                                />
                            </div>

                            {displayError && <p className="text-sm text-red-400">{displayError}</p>}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 py-2 rounded-md font-semibold"
                            >
                                {isSubmitting ? 'Signing in...' : 'Login To User Portal'}
                            </button>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="w-full border border-zinc-600 text-zinc-100 py-2 rounded-md hover:bg-zinc-900"
                            >
                                Continue with Google
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/register')}
                                className="w-full border border-zinc-600 text-zinc-100 py-2 rounded-md hover:bg-zinc-900"
                            >
                                Register Account
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;