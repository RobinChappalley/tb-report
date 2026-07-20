import config from 'config/config';

export async function POST(req) {
  const res = await req.json();

  // eslint-disable-next-line global-require
  const stripe = require('stripe')(config.stripeSecretKey);

  try {
    console.log('[createStripeCustomer] Creating for email:', res.email);
    const response = await stripe.customers.create({
      email: res.email,
      name: `${res.firstName} ${res.lastName}`,
    });

    console.log('[createStripeCustomer] Created:', response.id);
    return Response.json(response);
  } catch (e) {
    console.log('[createStripeCustomer] Error:', e.message, e.type, e.code);
    return Response.json({
      error: 'error.generic',
      context: 'create-stripe-customer',
    });
  }
}
