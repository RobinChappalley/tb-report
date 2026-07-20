import axios from 'axios';

import getOAuthHeader from 'utils/getOAuthHeader';
import getRestApiUrlPath from 'utils/getRestApiUrlPath';

export async function POST(req) {
  const res = await req.json();
  let paramRequest = [];

  if (res.slug) {
    paramRequest = [{ key: 'slug', value: res.slug }];
  }

  const urlCategory = getRestApiUrlPath('/v3/products/categories', [
    { key: 'slug', value: res.language },
  ]);

  const requestCategory = {
    url: urlCategory,
    method: 'GET',
  };

  // Get the product category ID (for the language)
  let category;
  try {
    category = await axios.get(urlCategory, {
      headers: {
        ...getOAuthHeader(requestCategory),
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    console.log(e.response);
    return Response.json({
      error: 'error.generic',
      context: 'products-fetch-category',
    });
  }

  try {
    const urlProducts = getRestApiUrlPath('/v3/products', [
      ...paramRequest,
      { key: 'category', value: category.data?.[0]?.id },
    ]);

    const requestProducts = {
      url: urlProducts,
      method: 'GET',
    };

    const response = await axios.get(urlProducts, {
      headers: {
        ...getOAuthHeader(requestProducts),
        'Content-Type': 'application/json',
      },
    });

    return Response.json(response.data);
  } catch (e) {
    console.log(e.response);
    return Response.json({
      error: 'error.generic',
      context: 'products-fetch-products',
    });
  }
}
