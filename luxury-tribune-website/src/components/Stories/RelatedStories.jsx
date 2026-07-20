import React from 'react';
import { useTranslation } from 'react-i18next';
import { parseISO } from 'date-fns';
import Script from 'next/script';
import PropTypes from 'prop-types';
import { toUpper } from 'ramda';

import StoryTeaser from 'components/StoryTeaser';
import { newsletter } from 'config/config';
import useWorldsOfLuxuries from 'hooks/useStories';
import { Input } from 'pages/inscription-newsletter';
import gtm from 'services/google-tag-manager';

const RelatedStories = ({ date }) => {
  const { t, i18n } = useTranslation();
  const formattedDate = parseISO(date);
  const { data } = useWorldsOfLuxuries({
    length: 2,
    lng: toUpper(i18n.language),
    cursor: '',
    date: formattedDate,
  });

  const handleNewsletterClick = () => {
    gtm.dl({
      language: i18n.language,
    });
    gtm.event('newsletter_subscription');
  };

  return (
    <div className="container !mt-40 md:!mt-100">
      <div className="md:mx-15 xl:mx-0 pb-10 md:pb-20 mb-15 md:mb-30 md:mt-20 lg:mt-0 border-b border-solid border-sand-500">
        <p className="font-soehneKraftig text-19 tracking-wide leading-28 uppercase">
          {t('post.keepReading')}
        </p>
      </div>
      <div className="md:mx-15 xl:mx-0">
        <div className="flex flex-wrap lg:flex-nowrap items-start justify-between mx-0 md:-mx-15 lg:-mx-15">
          {data &&
            data.edges.map((story, i) => (
              <div
                key={i}
                className="w-full md:w-1/2 lg:w-1/3 md:px-15 lg:px-15 mb-30 lg:mb-0"
              >
                <StoryTeaser story={story.node} />
              </div>
            ))}
          <div className="bg-sand-300 w-full md:w-1/2 lg:w-1/3 md:ml-15 p-20 md:p-25">
            <p className="uppercase font-soehneKraftig text-orange text-13 leading-17 tracking-wider mb-5">
              {t('newsletter.register')}
            </p>
            <h3 className="font-soehneKraftig text-25 leading-34 tracking-tightish mb-15">
              {t('newsletter.block.title')}
            </h3>
            <p className="text-19 leading-26 font-miloSerif mb-20">
              {t('newsletter.description')}
            </p>
            <Script
              strategy="afterInteractive"
              src="https://js.createsend1.com/javascript/copypastesubscribeformlogic.js"
            />
            <form
              className="flex items-center w-full js-cm-form"
              id="subForm"
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
                onClick={handleNewsletterClick}
              >
                {t('newsletter.register')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

RelatedStories.propTypes = {
  date: PropTypes.string,
};

export default RelatedStories;
