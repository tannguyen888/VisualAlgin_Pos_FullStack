import { Routes, Route, Navigate } from 'react-router-dom';
import adminRoutes from './adminRoutes';
import cashierRoutes from './cashierRoutes';
import accessRoutes  from './accessRoutes';
import CartPage               from '@/pages/cashier/CartSection/CartPage';
import CustomerPaymentSection from '@/pages/cashier/CustomerPaymentSection/CustomerPaymentSection';
import OrderHistory           from '@/pages/cashier/OrderHistory/OrderHistory';
import LoginPage              from '@/pages/Login/loginPage';
import StaffLoginPage         from '@/pages/Login/StaffLoginPage';
import SignUpPage             from '@/pages/Login/SignUpPage';
import OAuthSuccessPage       from '@/pages/Login/OAuthSuccessPage';
import MainPageStore          from '@/pages/store/MainPageStore';
import ShopSlider             from '@/pages/store/shopSlider';
import UserCartPage           from '@/pages/store/UserCartPage';
import UserCheckoutPage       from '@/pages/store/UserCheckoutPage';

/**
 * AppRoutes — điểm duy nhất quản lý toàn bộ routes của app.
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Cách thêm trang mới:                                        │
 * │                                                             │
 * │  A. Trang thuộc cashier dashboard (có sidebar):             │
 * │     → Sửa src/routes/cashierRoutes.jsx                      │
 * │     → Thêm nav item trong CashierDashboardLayout.jsx        │
 * │                                                             │
 * │  B. Trang thuộc access / public:                            │
 * │     → Sửa src/routes/accessRoutes.jsx                       │
 * │                                                             │
 * │  C. Trang độc lập (không sidebar, không cashier):           │
 * │     → Import component rồi thêm <Route> trong file này      │
 * └─────────────────────────────────────────────────────────────┘
 */
function AppRoutes() {
    return (
        <Routes>
            {/* ── Cashier (có sidebar) ─────────────────────── */}
            {cashierRoutes}

            {adminRoutes}

            {/* ── Access / public pages ────────────────────── */}
            {accessRoutes}

            {/* ── Standalone legacy routes ─────────────────── */}
            <Route path="/"             element={<Navigate to="/access" replace />} />
            <Route path="/cart"          element={<CartPage />} />
            <Route path="/payment"       element={<CustomerPaymentSection />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/login"         element={<Navigate to="/user/login" replace />} />
            <Route path="/user/login"    element={<LoginPage />} />
            <Route path="/staff/login"   element={<StaffLoginPage />} />
            <Route path="/register"      element={<SignUpPage />} />
            <Route path="/oauth-success" element={<OAuthSuccessPage />} />
            <Route path="/store"         element={<MainPageStore />} />
            <Route path="/shopslider"    element={<ShopSlider />} />
            <Route path="/store/cart"    element={<UserCartPage />} />
            <Route path="/store/checkout" element={<UserCheckoutPage />} />
            <Route path="/store/payment" element={<Navigate to="/store/checkout" replace />} />

            {/* ── 404 ─────────────────────────────────────── */}
            <Route path="*" element={<div className="p-4">Page Not Found</div>} />
        </Routes>
    );
}

export default AppRoutes;
