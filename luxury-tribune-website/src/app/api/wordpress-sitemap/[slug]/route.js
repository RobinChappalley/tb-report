import axios from 'axios';

import config from 'config/config';

// eslint-disable-next-line consistent-return
export async function GET(_req, { params }) {
  try {
    let content =
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';

    await Promise.all(
      [
        `${config.baseApiHost}/${params.slug}-sitemap.xml`,
        `${config.baseApiHost}/${params.slug}-sitemap2.xml`,
        `${config.baseApiHost}/${params.slug}-sitemap3.xml`,
      ].map(async url => {
        try {
          await axios(url).then(response => {
            // Match the url HTML element and its content
            content += response.data.match(/(<url>.+<\/url>)/gs).join();
          });
        } catch (error) {
          console.log(url, error.response);
        }
      })
    );

    content += '</urlset>';

    return new Response(content, {
      status: 200,
      headers: { 'content-type': 'text/xml' },
    });
  } catch (error) {
    console.log(error);
    return new Response('', {
      status: 500,
    });
  }
}
