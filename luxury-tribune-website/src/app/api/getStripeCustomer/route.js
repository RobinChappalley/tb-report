import config from 'config/config';

export async function POST(req) {
  const res = await req.json();

  // eslint-disable-next-line global-require
  const stripe = require('stripe')(config.stripeSecretKey);

  try {
    if (!res.email) {
      console.log('[getStripeCustomer] No email provided');
      return Response.json({
        error: 'error.generic',
        context: 'get-stripe-customer-no-email',
      });
    }

    const response = await stripe.customers.list({
      limit: 1,
      email: res.email,
    });

    console.log(
      '[getStripeCustomer] Found:',
      response?.data?.length,
      'customers'
    );
    return Response.json(response?.data?.[0] ?? null);
  } catch (e) {
    console.log('[getStripeCustomer] Error:', e.message, e.type, e.code);
    return Response.json({
      error: 'error.generic',
      context: 'get-stripe-customer',
    });
  }
}
