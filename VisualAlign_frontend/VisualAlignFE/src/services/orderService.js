import { requestJson } from '@/services/apiClient';

export function createOrder(orderPayload) {
    return requestJson('/api/orders/create', {
        method: 'POST',
        body: orderPayload,
        useAuth: true,
    });
}

export function getOrdersByCustomerId(customerId) {
    return requestJson(`/api/orders/customer/${customerId}`, {
        method: 'GET',
        useAuth: true,
    });
}

export function getOrdersByCashierId(cashierId) {
    return requestJson(`/api/orders/cashier/${cashierId}`, {
        method: 'GET',
        useAuth: true,
    });
}

export function getOrdersByBranchId(branchId) {
    return requestJson(`/api/orders/branch/${branchId}/filter`, {
        method: 'GET',
        useAuth: true,
    });
}

export function getRecentOrdersByBranchId(branchId) {
    return requestJson(`/api/orders/recent/${branchId}`, {
        method: 'GET',
        useAuth: true,
    });
}
