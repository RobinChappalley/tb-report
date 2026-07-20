/* eslint-disable radix */
import axios from 'axios';
import { addSeconds } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { isEmpty } from 'ramda';

import getOAuthHeader from 'utils/getOAuthHeader';
import getRestApiUrlPath from 'utils/getRestApiUrlPath';

export async function POST(req) {
  const res = await req.json();

  const orderData = {
    status: res.subscriptionIsStudent === 'true' ? 'pending' : 'active',
    billing_period: res.subscriptionType === 'Mensuel' ? 'month' : 'year',
    billing_interval: 1,
    line_items: [],
  };

  if (res.stripeCustomerId && res.stripeSourceId) {
    orderData.payment_method = 'stripe';
    orderData.payment_details = {
      post_meta: {
        _stripe_customer_id: res.stripeCustomerId,
        _stripe_card_id: res.stripeSourceId,
      },
    };
  }

  let index = 0;
  if (res.lineItemId) {
    orderData.line_items[index] = {
      id: res.lineItemId,
      product_id: null,
    };
    index += 1;
  }

  orderData.line_items[index] = {
    product_id: res.subscriptionId,
    quantity: 1,
  };

  if (!isEmpty(res.coupon)) {
    // Discount is not automatically applied to the total
    const discount = parseInt(res.coupon.amount);
    let total = parseInt(res.subscriptionPriceInChf);
    if (res.coupon.discount_type.includes('percent')) {
      total -= (discount / 100) * total;
    } else {
      total -= discount;
      if (total < 0) {
        total = 0;
      }
    }
    orderData.line_items[0].total = `${total.toFixed(2)}`;

    orderData.coupon_lines = [
      {
        code: res.coupon.code,
        discount: res.coupon.amount,
      },
    ];
  }

  const now = new Date();
  const timeZone = 'Europe/London';
  const zonedDate = utcToZonedTime(now, timeZone);
  const nextPayment = addSeconds(zonedDate, 30);
  orderData.next_payment_date = format(nextPayment, 'yyyy-MM-dd HH:mm:ss', {
    timeZone,
  });

  const url = getRestApiUrlPath(`/v3/subscriptions/${res.subscription_id}`);

  const request = {
    url,
    method: 'PUT',
    body: orderData,
  };

  try {
    const response = await axios.put(url, orderData, {
      headers: {
        ...getOAuthHeader(request),
        'Content-Type': 'application/json',
      },
    });

    return Response.json(response.data);
  } catch (e) {
    console.log(
      '[updateSubscription] Error:',
      e.response?.status,
      e.response?.data?.message
    );
    return Response.json({
      error: 'error.generic',
      context: 'update-subscription',
    });
  }
}
