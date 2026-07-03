const handledCartActions = new Set();

export function createCartActionId(productId) {
    return `${productId ?? 'product'}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function buildCartActionKey(locationKey, routeState) {
    if (!routeState?.preselectedProduct) return '';

    if (routeState.cartActionId) {
        return String(routeState.cartActionId);
    }

    const fallbackProductId = routeState.preselectedProduct?.id ?? 'unknown';
    return `legacy-${locationKey}-${fallbackProductId}`;
}

export function consumeCartActionOnce(actionKey) {
    if (!actionKey) return false;
    if (handledCartActions.has(actionKey)) return false;

    handledCartActions.add(actionKey);
    return true;
}

export function __resetHandledCartActionsForTests() {
    handledCartActions.clear();
}
