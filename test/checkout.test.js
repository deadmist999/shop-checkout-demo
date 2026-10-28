import { test } from 'node:test';
import assert from 'node:assert/strict';
import { placeOrder, total } from '../src/checkout.js';

const cart = [{ price: 40, quantity: 2 }, { price: 20, quantity: 1 }];

test('total adds up the cart', () => {
  assert.equal(total(cart), 100);
});

test('a card that needs no extra checks places the order', async () => {
  const provider = { charge: async () => ({ id: 'p1', status: 'succeeded' }) };
  assert.deepEqual(await placeOrder(cart, { number: '4242' }, provider), { ok: true, orderId: 'ord_p1' });
});
