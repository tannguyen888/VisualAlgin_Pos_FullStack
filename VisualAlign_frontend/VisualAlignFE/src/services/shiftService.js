import { requestJson } from '@/services/apiClient';
import { getCurrentUser } from '@/lib/authSession';

function toIsoParam(dateLike) {
    if (!dateLike) return null;
    const date = new Date(dateLike);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString();
}

export function startShift({ cashierId, branchId, shiftStart } = {}) {
    const params = new URLSearchParams();
    params.set('cashierId', String(cashierId));
    if (branchId) params.set('branchId', String(branchId));

    const iso = toIsoParam(shiftStart);
    if (iso) params.set('shiftStart', iso);

    return requestJson(`/api/shift-reports/start?${params.toString()}`, {
        method: 'POST',
        useAuth: true,
    });
}

export function endShift(shiftReportId, shiftEnd) {
    const params = new URLSearchParams();
    const iso = toIsoParam(shiftEnd);
    if (iso) params.set('shiftEnd', iso);

    const suffix = params.toString() ? `?${params.toString()}` : '';
    return requestJson(`/api/shift-reports/${shiftReportId}/end${suffix}`, {
        method: 'PUT',
        useAuth: true,
    });
}

export function getActiveShiftByCashierId(cashierId) {
    return requestJson(`/api/shift-reports/cashier/${cashierId}/active`, {
        method: 'GET',
        useAuth: true,
    });
}

export function getShiftReportsByCashierId(cashierId) {
    return requestJson(`/api/shift-reports/cashier/${cashierId}`, {
        method: 'GET',
        useAuth: true,
    });
}

export async function ensureShiftStartedForUser(user = getCurrentUser()) {
    if (!user?.id) return null;

    try {
        const active = await getActiveShiftByCashierId(user.id);
        if (active?.id) return active;
    } catch {
        // If no active shift exists, start a new one below.
    }

    try {
        return await startShift({
            cashierId: user.id,
            branchId: user.branchId,
        });
    } catch {
        return null;
    }
}

export async function endActiveShiftForUser(user = getCurrentUser()) {
    if (!user?.id) return null;

    try {
        const active = await getActiveShiftByCashierId(user.id);
        if (!active?.id) return null;
        return await endShift(active.id);
    } catch {
        return null;
    }
}
