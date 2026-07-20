import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import FadeInImage from 'components/FadeInImage';
import { defaultLng } from 'locales/languages';

const StoryTeaser = ({ story }) => {
  const { i18n } = useTranslation();

  return (
    <div>
      {story.story.image?.sourceUrl && (
        <Link
          href={`${
            i18n.language === defaultLng ? '' : `/${i18n.language}`
          }/stories/${story.slug}`}
        >
          <figure
            className="hover:opacity-90 mb-20"
            style={{ transition: '0.15s opacity' }}
          >
            {!isNil(story?.story?.imageFormat) &&
              story.story?.imageFormat === 'square' && (
                <div className={story.story?.imageFormat}>
                  <FadeInImage
                    src={story.story.image?.sourceUrl}
                    alt={story.title}
                    width={1}
                    height={1}
                    className="object-cover"
                  />
                </div>
              )}
            {!isNil(story?.story.imageFormat) &&
              story.story?.imageFormat === 'portrait' && (
                <div className={story.story?.imageFormat}>
                  <FadeInImage
                    src={story.story.image?.sourceUrl}
                    alt={story.title}
                    width={10}
                    height={13}
                    className="object-cover"
                  />
                </div>
              )}
            {(isNil(story?.story?.imageFormat) ||
              story.story?.imageFormat === 'landscape') && (
              <div className="landscape">
                <FadeInImage
                  src={story.story.image?.sourceUrl}
                  alt={story.title}
                  width={3}
                  height={2}
                  className="object-cover"
                />
              </div>
            )}
          </figure>
        </Link>
      )}
      <div className="md:pb-20 md:border-b border-solid border-sand-500">
        <div className="flex">
          {story?.story?.location && (
            <span className="text-orange uppercase font-soehneKraftig tracking-wider leading-17 text-13">
              {story?.story?.location}
            </span>
          )}
        </div>
        <Link
          href={`${
            i18n.language === defaultLng ? '' : `/${i18n.language}`
          }/stories/${story.slug}`}
          className="border-b border-solid border-transparent hover:border-brown-800 transition-all"
        >
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <h3 className="sm:mt-[5px] text-25 leading-34">{story.title}</h3>
        </Link>
        {story?.story?.description && (
          <div
            className="text-19 leading-26 mt-15 line-clamp-3"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: story?.story?.description }}
          />
        )}
      </div>
    </div>
  );
};

StoryTeaser.propTypes = {
  story: PropTypes.object,
};

export default StoryTeaser;
