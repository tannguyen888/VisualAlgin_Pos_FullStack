import { requestJson } from '@/services/apiClient';

export function getAllCustomers() {
    return requestJson('/api/customers/all', {
        method: 'GET',
        useAuth: true,
    });
}

export function searchCustomers(keyword) {
    return requestJson(`/api/customers/search?keyword=${encodeURIComponent(keyword)}`, {
        method: 'GET',
        useAuth: true,
    });
}
