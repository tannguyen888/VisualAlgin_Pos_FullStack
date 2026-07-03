import { Button } from '@/components/ui/button';
import { LogOut, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import ConfirmLogout from '@/components/ConfirmLogout/ConfirmLogout';
import { getCurrentUser } from '@/lib/authSession';

const SideBar = ({ navItems, onClose, isAdmin}) => {
    const [openConfirmLogout, setOpenConfirmLogout] = useState(false);
    const currentUser = getCurrentUser();
    const fileteredNavItems = {
        "data": navItems, 
        "admin": isAdmin,
    }


    const getAdmin= fileteredNavItems.admin.toString() == "true";
    const userName = currentUser?.fullName ?? currentUser?.name ?? 'Staff';
    const userEmail = currentUser?.email ?? 'No email';

    return (
        <div className="relative flex h-full w-64 flex-col border-r border-border bg-sidebar p-4">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="font-semibold">{getAdmin ? <p>Admin DashBoard</p> : <p>POS System</p>}</h1>
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-1">
                {navItems?.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-2 rounded px-3 py-2 text-sm transition-colors ${
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-border space-y-3">
                <div className="text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">{userName}</p>
                    <p className="truncate">{userEmail}</p>
                </div>
                <Button
                    variant="outline"
                    className="w-full justify-center border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => setOpenConfirmLogout(true)}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    End Shift & Logout
                </Button>
            </div>

            <ConfirmLogout isOpen={openConfirmLogout} onClose={() => setOpenConfirmLogout(false)} />
        </div>
    );
};

export default SideBar;

