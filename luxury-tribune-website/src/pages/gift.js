import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getSubscriptionProducts } from 'client/wooCommerceClient';
import clsx from 'clsx';

import Layout from 'components/Layout';
import SEO from 'components/SEO/SEO';
import SubscriptionGiftForm from 'components/SubscriptionForm/SubscriptionGiftForm';
import SiteConfigContext from 'contexts/SiteConfigContext';
import { defaultLng } from 'locales/languages';

const Gift = () => {
  const { t, i18n } = useTranslation();
  const { setContentTranslations } = useContext(SiteConfigContext);
  const [signup, setSignup] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const fetchSubscriptions = async () => {
    await getSubscriptionProducts({
      slug: 'yearly',
      language: i18n.language,
    })().then(subscriptionData => setSubscription(subscriptionData));
  };

  useEffect(() => {
    fetchSubscriptions();
    setContentTranslations(
      [
        {
          language: { slug: 'en' },
          uri: '/en/gift',
        },
        {
          language: { slug: 'fr' },
          uri: '/gift',
        },
      ],
      i18n.language === defaultLng ? 'en/gift' : 'gift'
    );
  }, [i18n.language]);

  return (
    <Layout>
      {subscription && (
        <>
          <SEO title="Voucher" />
          <div className="mx-15 md:mx-0">
            <div className="content-container">
              <div className="!mt-30 md:!mt-50 flow-root">
                <h1>{t('subscription.gift.title')}</h1>
                <div className="mt-25 md:mt-30">
                  <h2 className="lead">{t('subscription.gift.lead')}</h2>
                </div>
              </div>
              <div className="mt-40 mb-60">
                <div className="subscription-card mb-60 card-white">
                  <h2 className="text-orange font-soehneKraftig mb-5">
                    {t('subscription.gift.complimentary')}
                  </h2>
                  <p className="text-13 leading-17 font-soehneLeicht">
                    {t('subscription.gift.value_gift')}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap mb-30 lg:mb-40 border-b border-sand-500">
                <button
                  className={clsx(
                    'mr-20 mt-15 pb-15 uppercase text-15 font-soehneKraftig tracking-wide leading-26',
                    signup ? 'text-orange relative' : 'text-brown-500'
                  )}
                  type="button"
                  onClick={() => setSignup(true)}
                >
                  {t('subscription.signup')}
                  {signup && (
                    <div
                      className="absolute w-full bg-orange"
                      style={{ bottom: '-1px', height: '2px' }}
                    />
                  )}
                </button>
                <button
                  className={clsx(
                    'mr-20 mt-15 pb-15 uppercase text-15 font-soehneKraftig tracking-wide leading-26',
                    !signup ? 'text-orange relative' : 'text-brown-500'
                  )}
                  type="button"
                  onClick={() => setSignup(false)}
                >
                  {t('subscription.login')}
                  {!signup && (
                    <div
                      className="absolute w-full bg-orange"
                      style={{ bottom: '-1px', height: '2px' }}
                    />
                  )}
                </button>
              </div>
              <SubscriptionGiftForm
                signup={signup}
                subscription={subscription}
              />
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Gift;
