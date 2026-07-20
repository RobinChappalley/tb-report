import axios from 'axios';

import getOAuthHeader from 'utils/getOAuthHeader';
import getRestApiUrlPath from 'utils/getRestApiUrlPath';

export async function POST(req) {
  const res = await req.json();

  try {
    const url = getRestApiUrlPath('/v3/customers', [
      { key: 'email', value: res.email },
      { key: 'role', value: 'all' },
    ]);

    const request = {
      url,
      method: 'GET',
    };

    const response = await axios.get(url, {
      headers: {
        ...getOAuthHeader(request),
        'Content-Type': 'application/json',
      },
    });

    return Response.json(response?.data?.[0]);
  } catch (e) {
    console.log(
      '[getCustomer] Error:',
      e.response?.status,
      e.response?.data?.message
    );
    return Response.json({
      error: 'error.generic',
      context: 'get-customer',
    });
  }
}
