
import { BrowserRouter as Router, NavLink, useLocation } from 'react-router-dom';
import AppRoutes from '@/routes';
import Show from './components/Show';
const navLinks = [
  // { to: '/', label: 'Shift Report' },
  { to: '/cashier', label: 'Cashier Dashboard' },
  { to: '/admin', label: 'Branch Manager' },
  // { to: '/cart', label: 'Cart' },
  // { to: '/customers', label: 'Customer Manager' },
  // { to: '/payment', label: 'Payment' },
  // { to: '/order-history', label: 'Order History' },
  { to: '/access', label: 'Access Title' },
];


function AppLayout() {
  const location = useLocation();
  const isAccessPage = location.pathname.startsWith('/access');
  const isCashierPage = location.pathname.startsWith('/cashier');
  const isAdminPage = location.pathname.startsWith('/admin');
  const isStorePage = location.pathname.startsWith('/store');
  const usesFixedViewport = isAccessPage || isCashierPage || isAdminPage;

  return (
      <div className={`${usesFixedViewport ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-background text-foreground flex flex-col`}>
        <Show when={!isAccessPage && !isCashierPage && !isAdminPage && !isStorePage}>
          <nav className="flex gap-1 px-4 py-2 border-b bg-card sticky top-0 z-10">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </Show>
        <div className="flex-1 overflow-hidden">
          <AppRoutes />
        </div>
      </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
