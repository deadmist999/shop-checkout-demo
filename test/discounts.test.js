import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyDiscount } from '../src/discounts.js';

const today = new Date('2026-10-28');

test('a valid code takes its percentage off the total', () => {
  assert.deepEqual(applyDiscount(100, 'WELCOME10', today), { ok: true, total: 90 });
});

test('codes are case-insensitive', () => {
  assert.equal(applyDiscount(100, ' welcome10 ', today).total, 90);
});

test('an expired code is rejected with a message and the total is unchanged', () => {
  assert.deepEqual(applyDiscount(100, 'SUMMER25', today), { ok: false, total: 100, message: 'This discount code has expired' });
});

test('an unknown code is rejected', () => {
  assert.equal(applyDiscount(100, 'FREE', today).message, 'This discount code does not exist');
});
