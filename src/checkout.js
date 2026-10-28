// Places an order once the payment provider confirms the charge. Cards that need 3-D Secure come
// back as "requires_action"; the customer completes the bank's challenge and the charge is confirmed.

export async function placeOrder(cart, card, provider, { completeChallenge } = {}) {
  let payment = await provider.charge({ amount: total(cart), card });
  if (payment.status === 'requires_action') {
    const result = await completeChallenge?.(payment.challengeUrl);
    if (!result?.approved) return { ok: false, message: 'Your bank did not approve the payment' };
    payment = await provider.confirm(payment.id);
  }
  if (payment.status !== 'succeeded') {
    return { ok: false, message: 'Payment failed' };
  }
  return { ok: true, orderId: `ord_${payment.id}` };
}

export function total(cart) {
  return cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
}
