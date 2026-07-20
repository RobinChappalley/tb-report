import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import CalendarCta from 'components/CalendarCta';
import SocialShare from 'components/SocialShare';
import resolveBlocksComponents from 'utils/resolveBlocksComponents';
import safePath from 'utils/safePath';

const Event = ({ content, host }) => {
  const { t } = useTranslation();
  const sponsorship = safePath('sponsorship.sponsored', content, false);

  return (
    <div className="mx-15 md:mx-0">
      <div className="content-container mt-30 md:mt-50 flow-root">
        <div className="inline-flex">
          <span className="text-orange uppercase text-15 font-soehneKraftig tracking-wider leading-20">
            {t('event.homepage.event')}
          </span>
          {content.eventsCategories.nodes.length > 0 && (
            <span className="uppercase text-15 font-soehneKraftig tracking-wider leading-20 border-l border-solid border-sand-700 pl-5 ml-5">
              {content.eventsCategories.nodes[0].name}
            </span>
          )}
        </div>
        <h1>{content.title}</h1>
        <CalendarCta eventInfo={content.eventMetadata} title={content.title} />
      </div>
      {resolveBlocksComponents(content.editorBlocks).map(
        ({ component, props }, i) =>
          React.createElement(component, { key: i, ...props })
      )}
      {sponsorship && (
        <div className="content-container border-t border-b border-solid border-sand-500 my-60 py-10">
          <p className="font-soehneLeicht text-15 leading-22">
            {`${t('event.sponsorship')} `}
            {content.sponsorship?.sponsorlink && (
              <a
                href={content.sponsorship?.sponsorlink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-soehneKraftig tracking-wider uppercase"
              >
                {content.sponsorship?.sponsor}
              </a>
            )}
            {!content.sponsorship?.sponsorlink && (
              <span className="font-soehneKraftig tracking-wider uppercase">
                {content.sponsorship?.sponsor}
              </span>
            )}
          </p>
        </div>
      )}
      <div className="content-container !mt-30 md:!mt-60">
        <p className="font-soehneKraftig text-15 leading-22 uppercase tracking-wide">
          {t('event.share')}
        </p>
        <SocialShare host={host} contentType="event" title={content.title} />
      </div>
    </div>
  );
};

Event.propTypes = {
  content: PropTypes.object.isRequired,
  host: PropTypes.string,
};

export default Event;
