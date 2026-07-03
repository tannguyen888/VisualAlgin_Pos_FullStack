import { LogOutIcon, Route, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from 'react-router-dom';
import { clearAuthSession } from '@/lib/authSession';
import { useCartScope } from '@/context/CartContext';

function StorePageHeader({ userName = 'Guest' }) {
  const navigate = useNavigate();
  const { items } = useCartScope('user');
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/access', { replace: true });
  }
    return ( 
      <div className="flex bg-black text-white items-center justify-between mb-4">
                <h1 className="text-2xl font-bold flex items-center gap-2"><Route size={22} />Project Dream No.1</h1>
        <ul className="flex items-center gap-3">
            <li>
              <NavLink to="/store" className="text-sm text-white hover:bg-red-500 px-1">store</NavLink>
            </li>
            <li>
              <NavLink to="/store/cart" className="text-sm text-white hover:bg-red-500 px-1 flex items-center gap-1">
                <ShoppingCart size={14} /> cart ({totalItems})
              </NavLink>
            </li>
        </ul>
       <div className="flex flex-end gap-4">
        <span className="text-sm text-white self-center">Hello, {userName}</span>
        <Button className="hover:bg-red-500" size="sm" onClick={handleLogout}><LogOutIcon></LogOutIcon> Logout</Button>
       </div>
      </div>
     );
}

    export default StorePageHeader;