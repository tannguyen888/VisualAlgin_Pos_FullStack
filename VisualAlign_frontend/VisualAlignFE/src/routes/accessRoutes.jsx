import { Route } from 'react-router-dom';
import DelayShow        from '@/components/Show/DelayShow';
import LoadingPageDelay from '@/pages/LoadingPageDelay/LoadingPageDelay';
import AccessTitlePage  from '@/pages/AccessFirstPage/AccessTitlePage';
import TermsPage        from '@/pages/AccessFirstPage/TermsPage';
import PrivacyPage      from '@/pages/AccessFirstPage/PrivacyPage';
import FqaPage          from '@/pages/AccessFirstPage/FqaPage';
import AccessibilityPage from '@/pages/AccessFirstPage/AccessibilityPage';
import AccessCategoryPage from '@/pages/AccessFirstPage/AccessCategoryPage';

/**
 * accessRoutes — tất cả routes nằm dưới /access
 *
 * Cách thêm trang mới:
 *   1. Import component: import MyPage from '@/pages/AccessFirstPage/MyPage';
 *   2. Thêm Route:        <Route path="/access/my-path" element={<MyPage />} />
 */
const accessRoutes = (
    <>
        <Route
            path="/access"
            element={
                <DelayShow delay={2000} fallback={<LoadingPageDelay />}>
                    <AccessTitlePage />
                </DelayShow>
            }
        />
        <Route path="/access/terms"         element={<TermsPage />} />
        <Route path="/access/privacy"       element={<PrivacyPage />} />
        <Route path="/access/fqa"           element={<FqaPage />} />
        <Route path="/access/category/:categoryKey" element={<AccessCategoryPage />} />
        <Route path="/access/accessibility" element={<AccessibilityPage />} />
        {/* ── Thêm trang access mới ở đây ── */}
    </>
);

export default accessRoutes;
