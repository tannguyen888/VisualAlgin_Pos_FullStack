
import { useState } from 'react';
import SideBar from './SideBar';
import { Clock, CreditCard, Menu, Package, BarChart2, ReceiptIcon, RotateCcw, ShoppingCartIcon, Users, ClipboardList } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { getCurrentUserRole } from '@/lib/authSession';


const navItems = [
    {
        path: '/admin',
        icon: <ReceiptIcon size={18} />,
        label: 'Branch Management',
    },
    {
        path: '/admin/production',
        icon: <Package size={18} />,
        label: 'Production / Stock',
    },
    {
        path: '/admin/total-sales',
        icon: <BarChart2 size={18} />,
        label: 'Total Sales',
    },
    {
        path: '/admin/order-history',
        icon: <Clock size={18} />,
        label: 'Order History',
    },
    {
        path: '/admin/refund',
        icon: <RotateCcw size={18} />,
        label: 'Refund',
    },
    {
        path: '/admin/customers',
        icon: <Users size={18} />,
        label: 'Customers',
    },
    {
        path: '/admin/cart',
        icon: <ShoppingCartIcon size={18} />,
        label: 'POS Terminal',
    },
    {
        path: '/admin/payment',
        icon: <CreditCard size={18} />,
        label: 'Payment',
    },
    {
        path: '/cashier',
        icon: <ClipboardList size={18} />,
        label: 'Cashier Dashboard',
    },
    {
        path: '/admin/employees',
        icon: <Users size={18} />,
        label: 'Employee Management',
    },
];
  //isadmin se dc goi trong phan login in o day de check quyen truy cap, neu la admin thi se render ra trang admin, neu khong thi se hien thong bao khong co quyen truy cap
function AdminDashBoardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isAdmin = getCurrentUserRole() === 'admin';
   
    if(!isAdmin) {
      return (
        <span>You don't have right access this resources!</span>
            )
        }else{
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
                <SideBar navItems={navItems} isAdmin={isAdmin} onClose={() => setSidebarOpen(false)} />
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
}

export default AdminDashBoardLayout;