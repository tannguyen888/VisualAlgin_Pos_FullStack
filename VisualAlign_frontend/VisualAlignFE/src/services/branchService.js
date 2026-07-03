import { requestJson } from '@/services/apiClient';

export function getBranchesByStoreId(storeId) {
    return requestJson(`/api/branches/store/${storeId}`, {
        method: 'GET',
        useAuth: true,
    });
}
