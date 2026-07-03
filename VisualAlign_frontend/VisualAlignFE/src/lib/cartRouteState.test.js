import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildCartActionKey,
    consumeCartActionOnce,
    createCartActionId,
    __resetHandledCartActionsForTests,
} from './cartRouteState.js';

test('createCartActionId creates unique non-empty values', () => {
    const id1 = createCartActionId(1);
    const id2 = createCartActionId(1);

    assert.ok(id1.length > 0);
    assert.ok(id2.length > 0);
    assert.notEqual(id1, id2);
});

test('buildCartActionKey prefers explicit cartActionId', () => {
    const key = buildCartActionKey('abc', {
        preselectedProduct: { id: 10 },
        cartActionId: 'action-10',
    });

    assert.equal(key, 'action-10');
});

test('buildCartActionKey falls back to location key + product id', () => {
    const key = buildCartActionKey('xyz', {
        preselectedProduct: { id: 77 },
    });

    assert.equal(key, 'legacy-xyz-77');
});

test('consumeCartActionOnce returns true only for first consume', () => {
    __resetHandledCartActionsForTests();

    assert.equal(consumeCartActionOnce('route-action-1'), true);
    assert.equal(consumeCartActionOnce('route-action-1'), false);
});
