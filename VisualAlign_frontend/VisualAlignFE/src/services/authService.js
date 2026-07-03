import { requestJson } from '@/services/apiClient';
import { API_BASE_URL } from '@/services/apiClient';

export function login(email, password) {
    return requestJson('/auth/login', {
        method: 'POST',
        body: { email, password },
        useAuth: false,
    });
}

export function register({ fullName, email, password }) {
    return requestJson('/auth/register', {
        method: 'POST',
        body: {
            fullName,
            email,
            password,
            role: 'ROLE_USER',
        },
        useAuth: false,
    });
}

export function getGoogleOAuthLoginUrl(frontendOrigin) {
    const origin = frontendOrigin || window.location.origin;
    const returnUrl = encodeURIComponent(origin);
    return `${API_BASE_URL}/oauth2/authorization/google?frontend_origin=${returnUrl}`;
}

export function getCurrentUserByToken(token) {
    return requestJson('/auth/me', {
        method: 'GET',
        useAuth: false,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
