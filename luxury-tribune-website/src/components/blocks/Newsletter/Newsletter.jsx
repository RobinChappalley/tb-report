import React from 'react';
import { useTranslation } from 'react-i18next';
import Script from 'next/script';

import NewsletterType from 'components/NewsletterType';
import { newsletter } from 'config/config';
import { Input } from 'pages/inscription-newsletter';
import gtm from 'services/google-tag-manager';

const Newsletter = () => {
  const { t, i18n } = useTranslation();

  const handleClick = () => {
    gtm.dl({
      language: i18n.language,
    });
    gtm.event('newsletter_subscription');
  };

  return (
    <>
      <div className="content-container bg-sand-300 p-20 !my-20 md:!my-30">
        <p className="uppercase font-soehneKraftig text-orange text-13 leading-17 tracking-wider mb-5">
          {t('newsletter.title')}
        </p>
        <h3 className="font-soehneKraftig text-21 leading-31 mb-5">
          {t('newsletter.block.title')}
        </h3>
        <p className="text-19 leading-26 font-miloSerif mb-15">
          {t('newsletter.description')}
        </p>
        <div className="flex flex-wrap gap-10 mb-20">
          <NewsletterType type="news" variant="outlined" />
          <NewsletterType type="genz" variant="outlined" />
          <NewsletterType type="analyses" variant="outlined" />
          <NewsletterType type="trends" variant="outlined" />
        </div>
        <hr className="mb-20 border-sand-700" />
        <Script
          strategy="afterInteractive"
          src="https://js.createsend1.com/javascript/copypastesubscribeformlogic.js"
        />
        <form
          className="flex items-center w-full js-cm-form"
          id="subFormBlock"
          action="https://www.createsend.com/t/subscribeerror?description="
          method="post"
          data-id={newsletter[i18n.language].dataId}
        >
          <Input
            id="fieldEmail"
            name={newsletter[i18n.language].email}
            type="email"
            placeholder={t('newsletter.block.placeholder')}
            className="js-cm-email-input qa-input-email w-full text-15 input-nl border-transparent"
          />
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <Input
            id="typeNews"
            name={newsletter[i18n.language].mewsletterType.id}
            value={newsletter[i18n.language].mewsletterType.news}
            type="hidden"
            className="hidden"
          />
          <Input
            id="typeGenz"
            name={newsletter[i18n.language].mewsletterType.id}
            value={newsletter[i18n.language].mewsletterType.genz}
            type="hidden"
            className="hidden"
          />
          <Input
            id="typeAnalyses"
            name={newsletter[i18n.language].mewsletterType.id}
            value={newsletter[i18n.language].mewsletterType.analyses}
            type="hidden"
            className="hidden"
          />
          <Input
            id="typeTrends"
            name={newsletter[i18n.language].mewsletterType.id}
            value={newsletter[i18n.language].mewsletterType.trends}
            type="hidden"
            className="hidden"
          />
          <button
            className="btn btn-primary btn-md ml-15 text-13 leading-17 tracking-wider"
            type="submit"
            onClick={handleClick}
          >
            {t('newsletter.register')}
          </button>
        </form>
      </div>
    </>
  );
};

export default Newsletter;
