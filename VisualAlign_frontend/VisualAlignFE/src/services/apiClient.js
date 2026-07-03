import { getAuthToken } from '@/lib/authSession';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

function buildHeaders(headers = {}, useAuth = true, hasBody = false) {
    const nextHeaders = { ...headers };
    const hasContentType = Object.keys(nextHeaders).some(
        (key) => key.toLowerCase() === 'content-type'
    );

    if (hasBody && !hasContentType) {
        nextHeaders['Content-Type'] = 'application/json';
    }

    if (useAuth) {
        const token = getAuthToken();
        if (token) {
            nextHeaders.Authorization = `Bearer ${token}`;
        }
    }

    return nextHeaders;
}

async function parseResponse(response) {
    const text = await response.text();
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

export async function requestJson(path, { method = 'GET', body, headers, useAuth = true } = {}) {
    const hasBody = body !== undefined && body !== null;
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: buildHeaders(headers, useAuth, hasBody),
        body: hasBody ? JSON.stringify(body) : undefined,
    });

    const payload = await parseResponse(response);

    if (!response.ok) {
        const message = payload?.message || payload?.error || `Request failed: ${response.status}`;
        throw new Error(message);
    }

    return payload;
}

export { API_BASE_URL };
