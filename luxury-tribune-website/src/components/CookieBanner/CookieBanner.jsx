import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CookieBanner = () => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const leckerliScript = document.createElement('script');
    leckerliScript.src =
      'https://unpkg.com/@antistatique/leckerli@1.2/dist/assets/leckerli.min.js';
    document.body.appendChild(leckerliScript);

    window.leckerliSettings = {
      banner: {
        name: 'gtm-leckerli',
        title: undefined,
        description: t('cookie_banner.description'),
        accept: t('cookie_banner.btn.accept'),
        reject: t('cookie_banner.btn.reject'),
        customise: t('cookie_banner.btn.customise'),
        save: t('cookie_banner.btn.save'),
        settings: [
          {
            slug: 'analytics_storage',
            title: t('cookie_banner.settings.analytics_storage.title'),
            description: t(
              'cookie_banner.settings.analytics_storage.description'
            ),
          },
          {
            slug: 'ad_storage',
            title: t('cookie_banner.settings.ad_storage.title'),
            description: t('cookie_banner.settings.ad_storage.description'),
          },
        ],
      },
      permissions: ['analytics_storage', 'ad_storage'],
    };
  }, [i18n.language]);

  return <></>;
};

export default CookieBanner;
