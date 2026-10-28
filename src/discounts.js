// Discount codes: a code takes a percentage off the cart total until it expires.

const CODES = {
  WELCOME10: { percent: 10, expires: '2099-12-31' },
  SUMMER25: { percent: 25, expires: '2026-08-31' },
};

export function applyDiscount(total, code, today = new Date()) {
  const discount = CODES[String(code ?? '').trim().toUpperCase()];
  if (!discount) return { ok: false, total, message: 'This discount code does not exist' };
  if (today > new Date(`${discount.expires}T23:59:59Z`)) return { ok: false, total, message: 'This discount code has expired' };
  return { ok: true, total: Math.round(total * (100 - discount.percent)) / 100 };
}
