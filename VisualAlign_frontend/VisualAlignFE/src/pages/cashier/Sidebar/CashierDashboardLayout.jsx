
import { useState } from 'react';
import SideBar from './SideBar';
import { Clock, CreditCard, Menu, ReceiptIcon, RotateCcw, ShoppingCartIcon, Users } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { getCurrentUserRole } from '@/lib/authSession';


const navItems = [
    {
        path: '/cashier/cart',
        icon: <ShoppingCartIcon size={18} />,
        label: 'POS Terminal',
    },
    {
        path: '/cashier/order-history',
        icon: <Clock size={18} />,
        label: 'Order History',
    },
    {
        path: '/cashier/refund',
        icon: <RotateCcw size={18} />,
        label: 'Refund',
    },
    {
        path: '/cashier/customers',
        icon: <Users size={18} />,
        label: 'Customers',
    },
    {
        path: '/cashier/payment',
        icon: <CreditCard size={18} />,
        label: 'Payment',
    },
    {
        path: '/cashier',
        icon: <ReceiptIcon size={18} />,
        label: 'Shift Summary',
    },
];

function CashierDashBoardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const notAdmin = false;
    const currentRole = getCurrentUserRole();
    const isAdminViewingCashier = currentRole === 'admin';
    const resolvedNavItems = isAdminViewingCashier
        ? [{ path: '/admin', icon: <ReceiptIcon size={18} />, label: 'Return To Admin Dashboard' }, ...navItems]
        : navItems;

    return (
        <div className="flex h-screen bg-background">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div
                className={`fixed left-0 top-0 z-30 h-full transition-transform duration-300 md:relative ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0`}
            >
                <SideBar navItems={resolvedNavItems} isAdmin={notAdmin} onClose={() => setSidebarOpen(false)} />
            </div>

            <div className="flex-1 overflow-auto">
                <div className="border-b px-4 py-3 md:hidden">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="inline-flex items-center gap-2 rounded border px-3 py-1.5 text-sm"
                    >
                        <Menu className="h-4 w-4" />
                        Menu
                    </button>
                </div>
                <Outlet />
            </div>
        </div>
    );
}

export default CashierDashBoardLayout;