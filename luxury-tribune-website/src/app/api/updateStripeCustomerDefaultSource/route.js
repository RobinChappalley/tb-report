import config from 'config/config';

export async function POST(req) {
  const res = await req.json();

  // eslint-disable-next-line global-require
  const stripe = require('stripe')(config.stripeSecretKey);

  try {
    const response = await stripe.customers.update(res.stripeCustomerId, {
      source: res.token,
    });

    return Response.json(response);
  } catch (e) {
    console.log(
      '[updateStripeDefaultSource] Error:',
      e.message,
      e.type,
      e.code
    );
    return Response.json({
      error: 'error.generic',
      context: 'update-stripe-default-source',
    });
  }
}
