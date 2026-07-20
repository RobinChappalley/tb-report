import axios from 'axios';

import getOAuthHeader from 'utils/getOAuthHeader';
import getRestApiUrlPath from 'utils/getRestApiUrlPath';

export async function POST(req) {
  const res = await req.json();

  const customerData = {
    email: res.email,
    first_name: res.firstName,
    last_name: res.lastName,
    username: res.email,
    password: res.password,
    billing: {
      first_name: res.firstName,
      last_name: res.lastName,
      city: res.city,
      country: res.country,
      email: res.email,
    },
    meta_data: [
      {
        key: 'language',
        value: res.locale,
      },
    ],
  };

  const url = getRestApiUrlPath('/v3/customers');

  const request = {
    url,
    method: 'POST',
    body: customerData,
  };

  try {
    const response = await axios.post(url, customerData, {
      headers: {
        ...getOAuthHeader(request),
        'Content-Type': 'application/json',
      },
    });

    return Response.json(response.data);
  } catch (e) {
    console.log(
      '[createCustomer] Error:',
      e.response?.status,
      e.response?.data?.message
    );
    return Response.json({
      error: 'error.account-exist',
      context: 'create-customer',
    });
  }
}
