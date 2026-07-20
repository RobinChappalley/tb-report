import config from 'config/config';

export async function POST(req) {
  const res = await req.json();

  // eslint-disable-next-line global-require
  const stripe = require('stripe')(config.stripeSecretKey);

  try {
    const response = await stripe.customers.createSource(res.stripeCustomerId, {
      source: res.token,
    });

    return Response.json(response);
  } catch (e) {
    console.log('[createStripeSource] Error:', e.message, e.type, e.code);
    return Response.json({
      error: 'error.generic',
      context: 'create-stripe-source',
    });
  }
}
