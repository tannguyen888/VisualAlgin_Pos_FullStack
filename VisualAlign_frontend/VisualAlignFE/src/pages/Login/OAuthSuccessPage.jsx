import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCurrentUserByToken } from '@/services/authService';
import { saveAuthSession, getDefaultRouteByRole } from '@/lib/authSession';

function OAuthSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setError('OAuth token is missing. Please try login again.');
            return;
        }

        const completeOAuthLogin = async () => {
            try {
                const user = await getCurrentUserByToken(token);
                const session = saveAuthSession({ jwt: token, user });
                navigate(getDefaultRouteByRole(session.role), { replace: true });
            } catch (oauthError) {
                setError(oauthError?.message || 'OAuth login failed. Please try again.');
            }
        };

        completeOAuthLogin();
    }, [navigate, searchParams]);

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
            <div className="w-full max-w-md border border-white/20 rounded-lg p-6 bg-white/5 backdrop-blur-sm text-center">
                <h1 className="text-2xl font-semibold">Signing you in...</h1>
                {!error && <p className="text-sm text-zinc-300 mt-3">Completing Google login and loading your account.</p>}
                {error && (
                    <>
                        <p className="text-sm text-red-400 mt-3">{error}</p>
                        <button
                            type="button"
                            onClick={() => navigate('/user/login', { replace: true })}
                            className="mt-4 px-4 py-2 border border-white/40 hover:bg-red-500 rounded"
                        >
                            Back to login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default OAuthSuccessPage;
