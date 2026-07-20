import axios from 'axios';

import getOAuthHeader from 'utils/getOAuthHeader';
import getRestApiUrlPath from 'utils/getRestApiUrlPath';

export async function POST(req) {
  const res = await req.json();

  if (res.coupon === '') {
    return Response.json({});
  }

  const url = getRestApiUrlPath('/v3/coupons', [
    { key: 'code', value: res.coupon },
  ]);

  const request = {
    url,
    method: 'GET',
  };

  try {
    const response = await axios.get(url, {
      headers: {
        ...getOAuthHeader(request),
        'Content-Type': 'application/json',
      },
    });

    return Response.json(response?.data?.[0]);
  } catch (e) {
    console.log(
      '[getCoupon] Error:',
      e.response?.status,
      e.response?.data?.message
    );
    return Response.json({
      error: 'error.coupon-invalid',
      context: 'get-coupon',
    });
  }
}
