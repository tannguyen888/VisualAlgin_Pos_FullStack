import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUserRole, getDefaultRouteByRole } from '@/lib/authSession';

function RoleGuard({ allowed = [], children }) {
    const location = useLocation();
    const role = getCurrentUserRole();

    if (!role) {
        return (
            <Navigate
                to="/staff/login"
                replace
                state={{
                    redirectTo: location.pathname,
                    redirectState: location.state,
                    reason: 'staff_auth_required',
                }}
            />
        );
    }

    if (allowed.length > 0 && !allowed.includes(role)) {
        return <Navigate to={getDefaultRouteByRole(role)} replace />;
    }

    return children;
}

export default RoleGuard;
