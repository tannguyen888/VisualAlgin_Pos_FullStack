import { Route } from 'react-router-dom';
import AdminDashBoardLayout      from '@/pages/cashier/Sidebar/AdminDashboardLayout';
import BranchManagerPage         from '@/pages/branch/admin/branchManagerPage';
import ProductionList            from '@/pages/branch/admin/ProductionList';
import TotalSalePage             from '@/pages/branch/admin/TotalSalepage';
import OrderHistory              from '@/pages/cashier/OrderHistory/OrderHistory';
import ReturnItemSection         from '@/pages/cashier/Refund/ReturnItemSection';
import CustomerManagerPage       from '@/pages/cashier/Customer Manager/CustomerManagerPage';
import CartPage                  from '@/pages/cashier/CartSection/CartPage';
import CustomerPaymentSection    from '@/pages/cashier/CustomerPaymentSection/CustomerPaymentSection';
import RoleGuard                 from '@/components/auth/RoleGuard';
import EmployeeManager           from '@/pages/branch/admin/EmployeeManager';

const AdminRoutes = (
    <Route path="/admin" element={<RoleGuard allowed={['admin']}><AdminDashBoardLayout /></RoleGuard>}>
        <Route index                 element={<BranchManagerPage />} />
        <Route path="production"    element={<ProductionList />} />
        <Route path="total-sales"   element={<TotalSalePage />} />
        <Route path="order-history" element={<OrderHistory />} />
        <Route path="refund"        element={<ReturnItemSection />} />
        <Route path="customers"     element={<CustomerManagerPage />} />
        <Route path="cart"          element={<CartPage />} />
        <Route path="payment"       element={<CustomerPaymentSection />} />
        <Route path="employees"     element={<EmployeeManager />} />
    </Route>
);

export default AdminRoutes;
