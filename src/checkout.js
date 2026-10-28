// Places an order once the payment provider confirms the charge.

export async function placeOrder(cart, card, provider) {
  const payment = await provider.charge({ amount: total(cart), card });
  if (payment.status !== 'succeeded') {
    return { ok: false, message: 'Payment failed' };
  }
  return { ok: true, orderId: `ord_${payment.id}` };
}

export function total(cart) {
  return cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
}
