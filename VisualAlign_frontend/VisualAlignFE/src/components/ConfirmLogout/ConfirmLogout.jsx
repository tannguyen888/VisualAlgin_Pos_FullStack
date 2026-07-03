import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { LogOut, X } from 'lucide-react';
import Button from '@/components/Button';
import { clearAuthSession, getCurrentUser } from '@/lib/authSession';
import { endActiveShiftForUser } from '@/services/shiftService';

/**
 * ConfirmLogout — Modal dialog xác nhận kết thúc ca và đăng xuất.
 * Dùng createPortal để render thẳng vào document.body,
 * tránh bị block bởi overflow / stacking context của parent.
 *
 * Props:
 *   isOpen  {boolean}  — hiển thị / ẩn dialog
 *   onClose {function} — callback đóng dialog (Cancel)
 */
function ConfirmLogout({ isOpen, onClose }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleConfirm = async () => {
        const currentUser = getCurrentUser();

        await endActiveShiftForUser(currentUser);
        clearAuthSession();
        onClose();
        navigate('/access', { replace: true });
    };

    return createPortal(
        /* Backdrop */
        <div
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            {/* Dialog card — stop propagation so clicking inside doesn't close */}
            <div
                className="relative w-full max-w-md rounded-xl bg-white border shadow-xl p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                {/* Icon */}
                <div className="flex items-center justify-center mb-4">
                    <div className="rounded-full bg-red-100 p-4">
                        <LogOut className="text-red-600" size={28} />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-center mb-2">
                    End Shift &amp; Logout
                </h2>

                {/* Body */}
                <p className="text-sm text-gray-500 text-center mb-6">
                    Are you sure you want to end your current shift and log out?
                    <br />
                    Make sure all transactions have been completed before proceeding.
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1 bg-red-500 text-white hover:bg-red-600"
                        onClick={handleConfirm}
                    >
                        <LogOut size={16} className="mr-2" />
                        Confirm Logout
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ConfirmLogout;

