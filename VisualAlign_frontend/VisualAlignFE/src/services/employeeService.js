import { requestJson } from '@/services/apiClient';

export function getStoreEmployees(storeId, role) {
    const qs = role ? `?userRole=${encodeURIComponent(role)}` : '';
    return requestJson(`/api/employees/store/${storeId}${qs}`, {
        method: 'GET',
        useAuth: true,
    });
}

export function createStoreEmployee(storeId, payload) {
    return requestJson(`/api/employees/store/${storeId}`, {
        method: 'POST',
        body: payload,
        useAuth: true,
    });
}

export function updateEmployee(employeeId, payload) {
    return requestJson(`/api/employees/${employeeId}`, {
        method: 'PUT',
        body: payload,
        useAuth: true,
    });
}

export function deleteEmployee(employeeId) {
    return requestJson(`/api/employees/${employeeId}`, {
        method: 'DELETE',
        useAuth: true,
    });
}

export function getCashierShiftReports(cashierId) {
    return requestJson(`/api/shift-reports/cashier/${cashierId}`, {
        method: 'GET',
        useAuth: true,
    });
}
