import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { gql, request } from 'graphql-request';
import he from 'he';
import { useRouter } from 'next/router';
import { isNil, pipe } from 'ramda';

import Lead from 'components/blocks/Lead';
import Layout from 'components/Layout';
import Page from 'components/Page';
import SEO from 'components/SEO/SEO';
import SubscriptionCard from 'components/Subscription/SubscriptionCard';
import Subscription from 'components/SubscriptionForm/Subscription';
import config, { subscriptionCurrencies } from 'config/config';
import SiteConfigContext from 'contexts/SiteConfigContext';
import useSpecificPage, { prefetchSpecificPage } from 'hooks/useSpecificPage';
import { defaultLng } from 'locales/languages';
import gtm from 'services/google-tag-manager';
import extractFirstLead from 'utils/extractFirstLead';
import handleFootnotesAnchors from 'utils/handleFootnotesAnchors';
import prefetch from 'utils/prefetch';

const slugs = {
  fr: 'sabonner',
  en: 'en/subscribe',
};
const getSlug = (lng = defaultLng) => slugs[lng];

// GraphQL query pour récupérer les données d'abonnement depuis la page Subscribe
const SUBSCRIPTION_DATA_QUERY = gql`
  query GetSubscriptionData {
    page(id: "subscribe", idType: URI) {
      title
      content
    }
  }
`;

// Fonction pour parser le contenu HTML et extraire les prix
const parseSubscriptionPrices = content => {
  const prices = [];

  // Pattern pour trouver les prix dans le format "CHF X-" pattern
  const priceRegex = /CHF\s+(\d+)[.-]?\s+per\s+(month|year)/gi;
  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = priceRegex.exec(content)) !== null) {
    const amount = parseInt(match[1], 10);
    const period = match[2].toLowerCase() === 'month' ? 'Mensuel' : 'Annuel';

    prices.push({
      id: prices.length + 1,
      name: period,
      acf: {
        CHF: amount,
        EUR: Math.round(amount * 0.9), // Approximation EUR = 90% CHF
        USD: Math.round(amount * 1.1), // Approximation USD = 110% CHF
        type: period,
        is_for_student: false,
        chf_description:
          period === 'Mensuel'
            ? 'Accès mensuel à tous les contenus'
            : 'Économisez 21.- CHF par an',
        eur_description:
          period === 'Mensuel'
            ? 'Monthly access to all content'
            : 'Save €21 per year',
        usd_description:
          period === 'Mensuel'
            ? 'Mensual access to all content'
            : 'Save $21 per year',
      },
    });
  }

  return prices;
};

// Hook pour récupérer les données d'abonnement via GraphQL
const useSubscriptionData = () =>
  useQuery({
    queryKey: ['subscriptionData'],
    queryFn: async () => {
      try {
        const result = await request(config.apiHost, SUBSCRIPTION_DATA_QUERY);
        if (result?.page?.content) {
          const subscriptions = parseSubscriptionPrices(result.page.content);
          return { subscriptions };
        }
        throw new Error('No content found');
      } catch (error) {
        console.warn('GraphQL Error, using fallback:', error);
        return null;
      }
    },
  });

const Subscribe = () => {
  const { setContentTranslations } = useContext(SiteConfigContext);
  const { t, i18n } = useTranslation();
  const { data } = useSpecificPage(getSlug(i18n.language));
  const { data: subscriptionData } = useSubscriptionData();

  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [currentCurrency, setCurrentCurrency] = useState('CHF');
  const { asPath } = useRouter();

  useEffect(() => {
    if (data) {
      setContentTranslations(data.translations, getSlug(i18n.language));
    }
  }, [data]);

  // Utilise les données GraphQL ou fallback vers les données fixes
  const subscriptions =
    subscriptionData?.subscriptions && subscriptionData.subscriptions.length > 0
      ? subscriptionData.subscriptions
      : [
          {
            id: 1,
            name: 'Mensuel',
            acf: {
              CHF: 10,
              EUR: 9,
              USD: 11,
              type: 'Mensuel',
              is_for_student: false,
              chf_description: 'Accès mensuel à tous les contenus',
              eur_description: 'Monthly access to all content',
              usd_description: 'Mensual access to all content',
            },
          },
          {
            id: 2,
            name: 'Annuel',
            acf: {
              CHF: 99,
              EUR: 89,
              USD: 109,
              type: 'Annuel',
              is_for_student: false,
              chf_description: 'Économisez 21.- CHF par an',
              eur_description: 'Save €21 per year',
              usd_description: 'Save $21 per year',
            },
          },
          {
            id: 3,
            name: 'Etudiant',
            acf: {
              CHF: 49,
              EUR: 44,
              USD: 54,
              type: 'Annuel',
              is_for_student: true,
              chf_description: 'Nous vous offrons 50%',
              eur_description: 'We offer you 50% off',
              usd_description: 'We offer you 50% off',
            },
          },
        ];

  useEffect(() => {
    gtm.dl({
      content_type: 'funnel',
    });
    gtm.event('PageView', {
      page_path: asPath,
      page_title: t('header.subscribe'),
    });
  }, [asPath]);

  return (
    <Layout>
      {data && (
        <>
          <SEO title={he.decode(data.title)} />
          {!selectedSubscription && (
            <>
              <div className="mx-15 md:mx-0">
                <div className="content-container !mt-30 md:!mt-50 flow-root">
                  {/* eslint-disable-next-line react/no-danger */}
                  <h1 dangerouslySetInnerHTML={{ __html: data.title }} />
                  {data.lead && <Lead lead={data.lead.lead} />}
                </div>
                <div className="container !mt-40 !mb-60">
                  <div>
                    <div className="flex items-center justify-center mb-50">
                      <p className="mr-20 tracking-wide uppercase text-15 text-brown-800 leading-20 font-soehneKraftig">
                        {t('subscription.price_in')}
                      </p>
                      <div className="p-5 bg-sand-300 currencies">
                        {subscriptionCurrencies.map((currency, index) => (
                          <button
                            key={`currency-btn-${index}`}
                            type="button"
                            className={clsx(
                              currentCurrency === currency
                                ? 'text-15 uppercase leading-20 tracking-wide font-soehneKraftig p-10 text-white bg-orange'
                                : 'text-15 uppercase leading-20 tracking-wide font-soehneKraftig p-10 text-brown-800'
                            )}
                            onClick={() => setCurrentCurrency(currency)}
                          >
                            {currency}
                          </button>
                        ))}
                      </div>
                    </div>

                    {subscriptions && subscriptions.length > 0 && (
                      <div className="flex flex-wrap justify-between md:mx-10">
                        {subscriptions.map((subscription, index) => (
                          <SubscriptionCard
                            subscription={subscription}
                            key={`card-subscription-${index}`}
                            currentCurrency={currentCurrency}
                            setSelectedSubscription={setSelectedSubscription}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Page
                content={pipe(extractFirstLead, handleFootnotesAnchors)(data)}
                withoutTitle
              />
            </>
          )}
          {selectedSubscription && (
            <Subscription subscription={selectedSubscription} />
          )}
        </>
      )}
    </Layout>
  );
};

export const getStaticProps = async () => {
  const prefetchQueries = [];
  Object.keys(slugs).forEach(key =>
    prefetchQueries.push(prefetchSpecificPage(slugs[key]))
  );
  const dehydratedState = await prefetch(prefetchQueries);
  return isNil(dehydratedState)
    ? { notFound: true, revalidate: 60 }
    : { props: { dehydratedState }, revalidate: 300 };
};

export default Subscribe;
