/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import Icon from 'components/Icon';
import Layout from 'components/Layout';
import NewsletterType from 'components/NewsletterType';
import SEO from 'components/SEO/SEO';
import { newsletter } from 'config/config';
import SiteConfigContext from 'contexts/SiteConfigContext';
import gtm from 'services/google-tag-manager';

export const Input = ({
  label,
  id,
  name,
  type,
  className = 'px-10 h-50 border-sand-500',
  placeholder,
  value,
}) => (
  <>
    {!isNil(label) && (
      <label
        htmlFor={id}
        className="tracking-wider uppercase font-soehneKraftig text-13"
      >
        {label}
      </label>
    )}
    <input
      aria-label={label}
      id={id}
      maxLength="200"
      name={name}
      required
      placeholder={placeholder ?? label}
      type={type}
      value={value}
      className={clsx(
        'px-20 py-10 text-19 leading-26 text-brown-800 font-soehneLeicht border border-solid border-sand-500 bg-white placeholder:text-brown-300 placeholder:text-15 focus:border-brown-300 hover:border-brown-300',
        className && className
      )}
    />
  </>
);

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

const InscriptionNewsletter = () => {
  const { t, i18n } = useTranslation();

  const { setContentTranslations } = useContext(SiteConfigContext);

  useEffect(() => {
    setContentTranslations(
      [
        {
          language: { slug: 'en' },
          uri: '/en/newsletter-subscription',
        },
      ],
      'en/newsletter-subscription'
    );
  }, []);

  const handleClick = () => {
    gtm.dl({
      language: 'fr',
    });
    gtm.event('newsletter_subscription');
  };

  const form = useRef();

  return (
    <Layout>
      <SEO
        title={t('newsletter.page.title')}
        metas={{ metaRobotsNoindex: 'noindex' }}
      >
        <script
          type="text/javascript"
          src="https://js.createsend1.com/javascript/copypastesubscribeformlogic.js"
        />
      </SEO>
      <div className="container mx-15 md:mx-auto sm:mx-10">
        <h1 className="!mt-30 md:!mt-30">{t('newsletter.page.title')}</h1>
        <p className="mt-10 text-18 md:text-25 mb-30 md:mt-30 font-soehneLeicht max-w-30em">
          {t('newsletter.page.lead')}
        </p>
      </div>
      <div className="container mx-15 md:mx-auto mb-60 md:max-10 sm:mx-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-10">
          {['news', 'genz', 'analyses', 'trends'].map(type => (
            <div key={type} className="flex flex-col bg-sand-300">
              <img
                src={`/newsletter_type_${type}.jpeg`}
                alt={`${t(`newsletter.types.${type}`)} newsletter`}
                className="w-full h-auto mb-10"
              />
              <div className="mx-10 mt-10">
                <NewsletterType type={type} variant="filled" />
              </div>
              <p className="mx-10 mt-20 text-16 leading-22 font-soehneLeicht text-brown-800 mb-30">
                {t(`newsletter.types.descriptions.${type}`)}
              </p>
              <div className="mt-auto border-t border-t-sand-500 mx-10 mb-10">
                <p className="text-13 font-soehneLeicht text-brown-500">
                  {t(`newsletter.types.frequency.${type}`)}
                </p>
                <a
                  href={t(`newsletter.types.pastEditionUrl.${type}`)}
                  className="text-12 font-soehneKraftig tracking-wider uppercase text-brown-800 border-b border-brown-800 hover:text-brown-500 hover:border-brown-500"
                >
                  {t('newsletter.types.pastEditionLink')}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-60 border-b border-b-sand-500 pb-60">
          {/* S'inscrire Section */}
          <h2 className="my-20 text-center">
            {t('newsletter.page.subscribe.title2')}
          </h2>
          <form
            ref={form}
            className="w-full js-cm-form flex items-center my-20 content-container"
            id="subForm"
            action="https://www.createsend.com/t/subscribeerror?description="
            method="post"
            data-id={newsletter[i18n.language].dataId}
          >
            <Input
              id="fieldEmail"
              name={newsletter[i18n.language].email}
              type="email"
              className="js-cm-email-input qa-input-email w-full text-15 input-nl leading-17"
              placeholder="E-mail"
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
              onClick={handleClick}
            >
              {t('newsletter.register')}
            </button>
          </form>
        </div>
      </div>
      <div className="content-container mx-15 md:mx-auto sm:mx-10">
        <div className="mt-60">
          {/* Avantages Section */}
          <h2 className="my-20">{t('newsletter.page.advantages.title')}</h2>
          <div className="space-y-20 mb-60">
            {['events', 'dossiers', 'offers', 'community'].map(item => (
              <div key={item} className="flex items-start">
                <Icon
                  name="check-mark"
                  className="!text-orange mr-15 flex-shrink-0"
                />
                <p>
                  <strong>
                    {t(`newsletter.page.advantages.items.${item}.emphasis`)}
                  </strong>
                  {t(`newsletter.page.advantages.items.${item}.text`)}
                </p>
              </div>
            ))}
          </div>
          {/* Une réponse aux enjeux du luxe Section */}
          <h2 className="my-20">{t('newsletter.page.response.title')}</h2>
          <p>{t('newsletter.page.response.paragraph1')}</p>
          <p>
            <Trans
              i18nKey="newsletter.page.response.paragraph2"
              components={[
                <Link
                  key="newsletter-subscribe-link"
                  href={t('newsletter.page.response.subscribeUrl')}
                  className="underline hover:text-brown-500 hover:border-brown-500"
                />,
              ]}
            />
          </p>

          {/* S'inscrire Section */}
          <h2 className="my-20">{t('newsletter.page.subscribe.title')}</h2>
          <p>{t('newsletter.page.subscribe.description')}</p>
        </div>
        <form
          ref={form}
          className="w-full js-cm-form flex items-center my-20"
          id="subForm"
          action="https://www.createsend.com/t/subscribeerror?description="
          method="post"
          data-id={newsletter[i18n.language].dataId}
        >
          <Input
            id="fieldEmail"
            name={newsletter[i18n.language].email}
            type="email"
            className="js-cm-email-input qa-input-email w-full text-15 input-nl leading-17"
            placeholder="E-mail"
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
            onClick={handleClick}
          >
            {t('newsletter.register')}
          </button>
        </form>
        <img
          className="mx-auto mb-40"
          src="/newsletter_preview.png"
          alt="Newsletter"
        />
      </div>
    </Layout>
  );
};

export default InscriptionNewsletter;
