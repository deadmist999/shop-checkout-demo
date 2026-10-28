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

const secure = {
  charge: async () => ({ id: 'p2', status: 'requires_action', challengeUrl: 'https://bank.example/3ds' }),
  confirm: async (id) => ({ id, status: 'succeeded' }),
};

test('a 3-D Secure card places the order once the challenge is approved', async () => {
  const result = await placeOrder(cart, { number: '4000 0027 6000 3184' }, secure, { completeChallenge: async () => ({ approved: true }) });
  assert.deepEqual(result, { ok: true, orderId: 'ord_p2' });
});

test('a declined 3-D Secure challenge does not place the order', async () => {
  const result = await placeOrder(cart, { number: '4000 0027 6000 3184' }, secure, { completeChallenge: async () => ({ approved: false }) });
  assert.deepEqual(result, { ok: false, message: 'Your bank did not approve the payment' });
});

test('the order total charged after 3-D Secure is the cart total', async () => {
  let charged;
  const provider = { ...secure, charge: async (p) => { charged = p.amount; return secure.charge(); } };
  await placeOrder(cart, {}, provider, { completeChallenge: async () => ({ approved: true }) });
  assert.equal(charged, 100);
});
