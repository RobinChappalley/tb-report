import axios from 'axios';

import getOAuthHeader from 'utils/getOAuthHeader';
import getRestApiUrlPath from 'utils/getRestApiUrlPath';

export async function POST(req) {
  const res = await req.json();

  try {
    const url = getRestApiUrlPath(`/v1/coupons/${res.couponId}`);

    const request = {
      url,
      method: 'DELETE',
    };

    const response = await axios.delete(
      // In v1, because endpoint hasn't been implemented in v3
      url,
      {
        headers: {
          ...getOAuthHeader(request),
          'Content-Type': 'application/json',
        },
      }
    );

    return Response.json(response?.data?.[0]);
  } catch (e) {
    console.log(
      '[deleteCoupon] Error:',
      e.response?.status,
      e.response?.data?.message
    );
    return Response.json({
      error: 'error.generic',
      context: 'delete-coupon',
    });
  }
}
