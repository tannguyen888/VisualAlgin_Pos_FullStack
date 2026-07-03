import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { LogIn, X, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/Button';
import { login } from '@/services/authService';
import { getDefaultRouteByRole, saveAuthSession } from '@/lib/authSession';
import { ensureShiftStartedForUser } from '@/services/shiftService';

function ConfirmLogin({ isOpen, onClose }) {
    const navigate = useNavigate();

    const [email,  setEmail]   = useState('');
    const [password,  setPassword]  = useState('');
    const [showPwd,   setShowPwd]   = useState(false);
    const [error,     setError]     = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleClose = () => {
        setEmail('');
        setPassword('');
        setError('');
        setShowPwd(false);
        onClose();
    };

    const handleConfirm = async () => {
        if (!email.trim() || !password) {
            setError('Vui lòng nhập email và mật khẩu.');
            return;
        }

        if (submitting) return;
        setSubmitting(true);

        try {
            const response = await login(email.trim(), password);
            const session = saveAuthSession(response);
            await ensureShiftStartedForUser(session.user);
            handleClose();
            navigate(getDefaultRouteByRole(session.role) || '/cashier', { replace: true });
        } catch (apiError) {
            setError(apiError?.message ?? 'Đăng nhập thất bại.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleConfirm();
    };

    return createPortal(
        <div
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50"
            onClick={handleClose}
        >
            <div
                className="relative w-full max-w-md rounded-xl bg-white border shadow-xl p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                {/* Icon */}
                <div className="flex items-center justify-center mb-4">
                    <div className="rounded-full bg-green-100 p-4">
                        <LogIn className="text-green-600" size={28} />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-center mb-1">Đăng nhập ca</h2>
                <p className="text-sm text-gray-500 text-center mb-5">Nhập email và mật khẩu để bắt đầu ca</p>

                {/* Email */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    onKeyDown={handleKeyDown}
                    type="email"
                    placeholder="staff@visualalign.com"
                    autoFocus
                    className="w-full mb-4 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />

                {/* Password */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <div className="relative mb-5">
                    <input
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        onKeyDown={handleKeyDown}
                        type={showPwd ? 'text' : 'password'}
                        placeholder="••••••"
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPwd((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                    >
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>

                {/* Error message */}
                {error && (
                    <p className="text-sm text-red-500 text-center mb-4">{error}</p>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={handleClose}>
                        Huỷ
                    </Button>
                    <Button
                        className="flex-1 bg-green-500 text-white hover:bg-green-600"
                        onClick={handleConfirm}
                        disabled={submitting}
                    >
                        <LogIn size={16} className="mr-2" />
                        {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ConfirmLogin;