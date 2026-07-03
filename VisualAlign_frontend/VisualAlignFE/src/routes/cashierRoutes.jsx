import { Route } from 'react-router-dom';
import CashierDashBoardLayout from '@/pages/cashier/Sidebar/CashierDashboardLayout';
import ShiftSummaryPage      from '@/pages/cashier/ShiftReport/ShiftSummaryPage';
import CartPage               from '@/pages/cashier/CartSection/CartPage';
import CustomerManagerPage    from '@/pages/cashier/Customer Manager/CustomerManagerPage';
import CustomerPaymentSection from '@/pages/cashier/CustomerPaymentSection/CustomerPaymentSection';
import OrderHistory           from '@/pages/cashier/OrderHistory/OrderHistory';
import ReturnItemSection      from '@/pages/cashier/Refund/ReturnItemSection';
import RoleGuard              from '@/components/auth/RoleGuard';
// import RefundPage             from '@/pages/cashier/Refund/RefundPage';
/**
 * cashierRoutes — tất cả routes nằm dưới /cashier
 *
 * Cách thêm trang mới:
 *   1. Import component: import MyNewPage from '@/pages/cashier/MyNewPage/MyNewPage';
 *   2. Thêm Route:        <Route path="my-path" element={<MyNewPage />} />
 *   3. Thêm nav item trong: src/pages/cashier/Sidebar/CashierDashboardLayout.jsx → navItems[]
 */
const cashierRoutes = (
    <Route path="/cashier" element={<RoleGuard allowed={['cashier', 'admin']}><CashierDashBoardLayout /></RoleGuard>}>
        <Route index                  element={<ShiftSummaryPage />} />
        <Route path="cart"            element={<CartPage />} />
        <Route path="customers"       element={<CustomerManagerPage />} />
        <Route path="payment"         element={<CustomerPaymentSection />} />
        <Route path="order-history"   element={<OrderHistory />} />
        <Route path="refund"           element={<ReturnItemSection />} />
        {/* <Route path="default refund" element={<RefundPage />} /> */}
        {/* ── Thêm trang cashier mới ở đây ── */}
    </Route>
);

export default cashierRoutes;
