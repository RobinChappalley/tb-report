/* eslint-disable react/no-danger */
import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { defaultLng } from 'locales/languages';
import gtm from 'services/google-tag-manager';

const Paywall = () => {
  const { t, i18n } = useTranslation();
  const { asPath } = useRouter();

  const handleClick = () => {
    gtm.dl({
      page_path: asPath,
    });
    gtm.event('paywall');
  };

  return (
    <div className="content-container !mt-30 md:!mt-50 flow-root relative paywall">
      <div className="blur-text" />
      <div className="card-padding card-white">
        <h3 className="mb-15 text-30 leading-40 tracking-tight">
          {t('paywall.title')}
        </h3>
        <p className="font-soehneLeicht text-21 text-brown-800 leading-31 mb-30">
          {t('paywall.subscription')}
        </p>
        <div>
          <Link
            href={
              i18n.language === defaultLng
                ? '/sabonner'
                : `/${i18n.language}/subscribe`
            }
            className="btn btn-normal btn-primary text-15"
            onClick={handleClick}
          >
            {t('paywall.cta')}
          </Link>
        </div>
        <div className="list content-container !my-30">
          <ul className="is-style-check-mark">
            <li
              dangerouslySetInnerHTML={{
                __html: t('paywall.list.unlimited-access'),
              }}
            />
            <li
              dangerouslySetInnerHTML={{
                __html: t('paywall.list.deep-analysis'),
              }}
            />
            <li
              dangerouslySetInnerHTML={{ __html: t('paywall.list.studies') }}
            />
            <li
              dangerouslySetInnerHTML={{
                __html: t('paywall.list.academic-articles'),
              }}
            />
            <li
              dangerouslySetInnerHTML={{ __html: t('paywall.list.events') }}
            />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
