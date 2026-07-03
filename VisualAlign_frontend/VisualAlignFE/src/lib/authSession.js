const AUTH_SESSION_KEY = 'visualalign.auth';

const ADMIN_ROLES = new Set([
    'ROLE_ADMIN',
    'ROLE_MANAGER',
    'ROLE_BRANCH_MANAGER',
    'ROLE_STORE_MANAGER',
    'ROLE_STORE_ADMIN',
]);

const CASHIER_ROLES = new Set([
    'ROLE_BRANCH_CASHIER',
    'ROLE_CASHIER',
]);

const USER_ROLES = new Set([
    'ROLE_USER',
]);

const LEGACY_ROLE_MAP = {
    admin: 'admin',
    manager: 'admin',
    cashier: 'cashier',
    store: 'user',
    user: 'user',
};

export function normalizeRole(role) {
    if (!role) return null;

    if (typeof role === 'string') {
        if (LEGACY_ROLE_MAP[role]) {
            return LEGACY_ROLE_MAP[role];
        }

        if (ADMIN_ROLES.has(role)) return 'admin';
        if (CASHIER_ROLES.has(role)) return 'cashier';
        if (USER_ROLES.has(role)) return 'user';
    }

    return null;
}

export function saveAuthSession(authResponse) {
    const payload = {
        token: authResponse?.jwt ?? '',
        user: authResponse?.user ?? null,
        role: normalizeRole(authResponse?.user?.role),
        rawRole: authResponse?.user?.role ?? null,
    };

    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(payload));
    return payload;
}

export function getAuthSession() {
    try {
        const raw = sessionStorage.getItem(AUTH_SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function clearAuthSession() {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
}

export function getAuthToken() {
    return getAuthSession()?.token ?? '';
}

export function getCurrentUser() {
    return getAuthSession()?.user ?? null;
}

export function getCurrentUserRole() {
    const session = getAuthSession();
    if (!session) return null;

    return session.role ?? normalizeRole(session.rawRole) ?? normalizeRole(session.user?.role);
}

export function getDefaultRouteByRole(role) {
    if (role === 'admin') return '/admin';
    if (role === 'cashier') return '/cashier';
    if (role === 'user') return '/store';
    return '/access';
}
