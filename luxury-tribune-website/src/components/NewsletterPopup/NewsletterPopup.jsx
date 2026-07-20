import React from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import Script from 'next/script';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';
import NewsletterType from 'components/NewsletterType';
import { newsletter } from 'config/config';
import { Input } from 'pages/inscription-newsletter';
import gtm from 'services/google-tag-manager';

const NewsletterPopup = ({ setOpenPopup }) => {
  const { t, i18n } = useTranslation();

  const handleClose = () => {
    setOpenPopup(false);
    // Hide the popup for 7 days
    Cookies.set('dismiss-nl-popup', 'true', { expires: 7 });
  };

  const handleBackgroundClick = event => {
    if (event && event.target !== event.currentTarget) {
      return;
    }
    setOpenPopup(false);
  };

  const handleKeyDown = event => {
    if (event.key === 'Escape') {
      handleBackgroundClick();
    }
  };

  const handleSubmit = () => {
    gtm.dl({
      language: i18n.language,
    });
    gtm.event('newsletter_subscription');
  };

  return (
    <div
      className="fixed inset-0 flex items-end md:items-center md:justify-center md:bg-black/50 z-10 pointer-events-auto"
      onClick={handleBackgroundClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={t('newsletter.popup.close')}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-popup-title"
        className="relative w-full md:max-w-[780px] md:flex"
      >
        {/* Image column - desktop only */}
        <div
          className="hidden md:block md:w-1/2 bg-sand-300 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/newsletter_preview.png)',
            backgroundSize: 'contain',
          }}
          aria-hidden="true"
        />

        {/* Content column */}
        <div className="relative p-15 md:p-25 md:w-1/2 bg-sand-300">
          <button
            type="button"
            onClick={handleClose}
            aria-label={t('newsletter.popup.close')}
            className="absolute right-15 md:right-0 top-0 -translate-y-1/2 md:translate-x-1/2 rounded-full w-30 md:w-25 h-30 md:h-25 inline-flex justify-center items-center text-white bg-brown-500"
          >
            <Icon name="close" className="!text-[8px] -translate-y-[1px]" />
          </button>

          <p className="uppercase font-soehneKraftig text-orange text-13 leading-17 tracking-wider mb-5">
            {t('newsletter.popup.subtitle')}
          </p>
          <h2
            id="newsletter-popup-title"
            className="mb-10 md:mb-15 text-25 md:text-30 leading-35 md:leading-40 tracking-tightish md:tracking-tight"
          >
            {t('newsletter.popup.title')}
          </h2>
          <p className="text-18 md:text-19 leading-26 tracking-normal">
            {t('newsletter.popup.description')}
          </p>
          <div className="flex flex-wrap gap-10 my-30">
            <NewsletterType type="news" variant="outlined" />
            <NewsletterType type="genz" variant="outlined" />
            <NewsletterType type="analyses" variant="outlined" />
            <NewsletterType type="trends" variant="outlined" />
          </div>
          <hr className="my-8 border-sand-700" />
          <Script
            strategy="afterInteractive"
            src="https://js.createsend1.com/javascript/copypastesubscribeformlogic.js"
          />
          <form
            className="mt-20 flex items-center w-full js-cm-form"
            id="subFormPopUp"
            action="https://www.createsend.com/t/subscribeerror?description="
            method="post"
            data-id={newsletter[i18n.language].dataId}
          >
            <Input
              id="fieldEmail"
              name={newsletter[i18n.language].email}
              type="email"
              placeholder={t('newsletter.popup.placeholder')}
              className="js-cm-email-input qa-input-email w-full text-15 border-transparent input-nl"
            />
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
              onClick={handleSubmit}
            >
              {t('newsletter.popup.button')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

NewsletterPopup.propTypes = {
  setOpenPopup: PropTypes.func.isRequired,
};

export default NewsletterPopup;
