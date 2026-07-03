import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoAndCurrentTime from '@/components/firstPage/LogoAndCurrentTime';
import { login } from '@/services/authService';
import { clearAuthSession, saveAuthSession, getCurrentUserRole, getDefaultRouteByRole } from '@/lib/authSession';
import { ensureShiftStartedForUser } from '@/services/shiftService';

function StaffLoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const existingRole = getCurrentUserRole();
        if (!existingRole) return;

        navigate(getDefaultRouteByRole(existingRole), { replace: true });
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Please enter staff email and password.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await login(email.trim(), password.trim());
            const session = saveAuthSession(response);

            if (session.role !== 'admin' && session.role !== 'cashier') {
                clearAuthSession();
                setError('This account is not allowed for staff portal.');
                return;
            }

            await ensureShiftStartedForUser(session.user);

            const redirectTo = location.state?.redirectTo;
            if (redirectTo) {
                navigate(redirectTo, { replace: true, state: location.state?.redirectState });
                return;
            }

            navigate(getDefaultRouteByRole(session.role), { replace: true });
        } catch (apiError) {
            setError(apiError?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="p-6">
                <LogoAndCurrentTime />
            </div>

            <div className="px-6 pb-8">
                <div className="min-h-[calc(100vh-9rem)] flex justify-center items-start pt-8">
                    <div className="w-full max-w-md border border-zinc-700 bg-zinc-950/90 rounded-xl p-6 shadow-xl">
                        <h1 className="text-2xl font-bold text-white text-center mb-1">Staff Login</h1>
                        <p className="text-xs text-zinc-400 text-center mb-5">For branch manager and cashier accounts only</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="staff-email" className="block text-sm text-zinc-200 mb-1">Email</label>
                                <input
                                    id="staff-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError('');
                                    }}
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 text-white px-3 py-2 outline-none focus:border-red-500"
                                    placeholder="staff@visualalign.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="staff-password" className="block text-sm text-zinc-200 mb-1">Password</label>
                                <input
                                    id="staff-password"
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

                            {error && <p className="text-sm text-red-400">{error}</p>}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 py-2 rounded-md font-semibold"
                            >
                                {isSubmitting ? 'Signing in...' : 'Login To Staff Portal'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StaffLoginPage;
