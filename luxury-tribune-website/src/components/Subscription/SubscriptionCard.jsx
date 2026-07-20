import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import { subscriptionPromoPeriod } from 'config/config';
import gtm from 'services/google-tag-manager';

const SubscriptionCard = ({
  subscription,
  currentCurrency,
  setSelectedSubscription,
}) => {
  const { t } = useTranslation();
  const { query } = useRouter();

  const handleClick = selectedSubscription => {
    gtm.dl({
      currency: currentCurrency,
      type: selectedSubscription?.acf?.type,
    });
    gtm.event('subscribe_step1');
    setSelectedSubscription({
      id: subscription.id,
      // eslint-disable-next-line camelcase
      isStudent: subscription?.acf?.is_for_student,
      title: subscription.name,
      price: subscription?.acf?.[currentCurrency],
      priceInChf: subscription?.acf?.CHF,
      type: subscription?.acf?.type,
      currency: currentCurrency,
      isRenewal: !!query?.renewal,
    });
  };
  const isPromoted =
    new Date() >= subscriptionPromoPeriod.promoStartDate &&
    new Date() <= subscriptionPromoPeriod.promoEndDate &&
    subscriptionPromoPeriod.promoProductId.includes(subscription.id);

  return (
    <div
      id={`subscription_${subscription.id}`}
      className={clsx(
        'flex flex-col justify-between subscription-card ',
        subscription?.acf?.is_for_student ? 'card-sand' : 'card-white',
        isPromoted ? 'border-orange border-4' : ''
      )}
    >
      <div className="flex-1 mb-20">
        <h2>{subscription?.name}</h2>
        <div className="flex items-start">
          {isPromoted ? (
            // active promo
            <span className="text-30 font-soehneKraftig leading-40">
              <s>{`${subscription?.acf?.[currentCurrency] || 'N/A'}`}</s>
              <span className="text-orange">
                {` ${
                  (subscription?.acf?.[currentCurrency] || 0) *
                  subscriptionPromoPeriod.percentage
                } `}
              </span>
            </span>
          ) : (
            // not activ promo
            <span className="text-orange text-30 font-soehneKraftig leading-40">
              {`${subscription?.acf?.[currentCurrency] || 'N/A'} `}
            </span>
          )}
          <span className="text-orange text-13 font-soehneKraftig leading-17 tracking-wide uppercase ml-5 mb-5 subscription-currency-type">
            {/* eslint-disable-next-line camelcase */}
            {`${currentCurrency} / `}
            {subscription?.acf?.type === 'Mensuel'
              ? t('subscription.type.monthly')
              : t('subscription.type.yearly')}
          </span>
        </div>
        {subscription?.acf?.[
          `${currentCurrency.toLowerCase()}_description`
        ] && (
          <span className="text-brown-800 text-15 font-soehneLeicht leading-22 mb-20">
            {
              subscription?.acf?.[
                `${currentCurrency.toLowerCase()}_description`
              ]
            }
          </span>
        )}
      </div>
      <div>
        <button
          type="button"
          className="text-15 leading-20 tracking-wide btn btn-normal btn-primary"
          onClick={() => handleClick(subscription)}
        >
          {t('subscription.cta')}
        </button>
      </div>
    </div>
  );
};

SubscriptionCard.propTypes = {
  subscription: PropTypes.object,
  currentCurrency: PropTypes.string,
  setSelectedSubscription: PropTypes.func,
};

export default SubscriptionCard;
