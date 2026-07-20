import axios from 'axios';

const post =
  (query, body = {}) =>
  // eslint-disable-next-line consistent-return
  async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/${query}`,
      body,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return response.data;
  };

export const getSubscriptionProducts = body => post('products', body);
export const createCustomer = body => post('createCustomer', body);
export const getCustomer = body => post('getCustomer', body);
export const createSubscription = body => post('createSubscription', body);
export const updateSubscription = body => post('updateSubscription', body);
export const listSubscriptionCustomer = body =>
  post('listSubscriptionCustomer', body);
export const getCoupon = body => post('getCoupon', body);
export const deleteCoupon = body => post('deleteCoupon', body);

// Stripe call
export const createStripeCustomer = body => post('createStripeCustomer', body);
export const getStripeCustomer = body => post('getStripeCustomer', body);
export const createStripeSource = body => post('createStripeSource', body);
export const updateStripeCustomerDefaultSource = body =>
  post('updateStripeCustomerDefaultSource', body);
