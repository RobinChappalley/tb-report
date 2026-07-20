import { useEffect, useState } from 'react';

import config from 'config/config';
import gtm from 'services/google-tag-manager';

export const getAds = ({ area, formats }) =>
  fetch(
    `${config.baseApiHost}/wp-json/ads-campaign/v1/area/${area}?formats=${formats}`
  ).then(res => res.json());

export const prefetchAds = ({ area, formats }) => getAds({ area, formats });

const useAds = ({ area, formats }) => {
  const [ads, setAds] = useState(null);

  useEffect(() => {
    getAds({ area, formats })
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          const key = Object.keys(data)[0];
          gtm.dl({
            ads_campaign_name: data[key].campaign.name,
            ads_campaign_id: data[key].campaign.id,
            ads_area: area,
            ads_formats: formats,
          });
          gtm.event('display_ads');
          fetch(
            `${config.baseApiHost}/wp-json/ads-campaign/v1/display/${data[key].campaign.id}/${area}`
          );
        }
        return data;
      })
      .then(data => setAds(data))
      .catch(error => console.error('Error fetching ads:', error));
  }, [area, formats]);

  return ads;
};

export default useAds;
