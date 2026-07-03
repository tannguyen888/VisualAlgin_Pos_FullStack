import { requestJson } from '@/services/apiClient';

export function getRefundsByBranchId(branchId) {
    return requestJson(`/api/refunds/branch/${branchId}`, {
        method: 'GET',
        useAuth: true,
    });
}
