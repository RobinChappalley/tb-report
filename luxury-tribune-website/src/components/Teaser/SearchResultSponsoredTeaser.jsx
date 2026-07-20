/* eslint-disable react/no-danger */
import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import FadeInImage from 'components/FadeInImage';
import getDate from 'utils/getDate';
import resolveCategory from 'utils/resolveCategory';
import sanitizeSlug from 'utils/sanitizeSlug';

const SearchResultSponsoredTeaser = ({ post, author }) => {
  const { t, i18n } = useTranslation();
  const getFormattedDate = getDate(
    i18n.language === 'fr' ? 'd MMMM yyyy' : 'MMMM d, yyyy'
  );

  return (
    <div className="md:flex">
      {post.featuredImage?.node && (
        <Link href={sanitizeSlug(post.uri)} className="md:w-1/3">
          <figure
            className="hover:opacity-90"
            style={{ transition: '0.15s opacity' }}
          >
            {!isNil(post?.teaserOptions) &&
              post.teaserOptions.imageformat === 'square' && (
                <div className={post.teaserOptions.imageformat}>
                  <FadeInImage
                    src={post.featuredImage?.sourceUrl}
                    alt={post.title}
                    width={1}
                    height={1}
                    className="object-cover"
                  />
                </div>
              )}
            {!isNil(post?.teaserOptions) &&
              post.teaserOptions.imageformat === 'portrait' && (
                <div className={post.teaserOptions.imageformat}>
                  <FadeInImage
                    src={post.featuredImage?.sourceUrl}
                    alt={post.title}
                    width={10}
                    height={13}
                    className="object-cover"
                  />
                </div>
              )}
            {isNil(post?.teaserOptions) ||
              (post.teaserOptions.imageformat === 'landscape' && (
                <div className="landscape">
                  <FadeInImage
                    src={post.featuredImage?.sourceUrl}
                    alt={post.title}
                    width={3}
                    height={2}
                    className="object-cover"
                  />
                </div>
              ))}
          </figure>
        </Link>
      )}
      <div
        className={clsx(
          'bg-sand-300 px-30 py-20',
          !isNil(post.featuredImage?.node) && 'md:w-2/3'
        )}
      >
        <div className="inline-flex">
          {post?.premium?.isPremium && (
            <span
              className="text-gold uppercase font-soehneKraftig tracking-wider text-12 leading-16 mr-10  border-solid border border-gold flex items-center"
              style={{ padding: '1px 4px' }}
            >
              {t('subscription.post.abbr')}
            </span>
          )}
          {post.categories && (
            <span
              style={{ paddingTop: '2px' }}
              className="text-orange uppercase font-soehneKraftig tracking-wider leading-17 text-13"
              dangerouslySetInnerHTML={{
                __html: resolveCategory(post.categories.nodes)?.name,
              }}
            />
          )}
          <span
            style={{ paddingTop: '2px' }}
            className="uppercase font-soehneKraftig tracking-wider leading-17 border-l border-solid border-sand-700 pl-5 ml-5 text-13"
          >
            {t('post.sponsor')}
          </span>
        </div>
        <h3 className="text-25 leading-35">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <Link
            href={sanitizeSlug(post.uri)}
            className="hover:border-b border-solid border-brown-800"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
        </h3>
        <div
          className="text-19 leading-26 mt-15"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        {(author || post.date) && (
          <div className="md:flex items-center mt-10 md:mt-15 space-y-[2px] md:space-y-0 md:space-x-[2px]">
            {author && (
              <p className="text-19">
                By
                <Link href={sanitizeSlug(author.uri)}>
                  <span
                    className="font-soehneKraftig uppercase tracking-wide text-15 leading-20"
                    dangerouslySetInnerHTML={{
                      __html: ` ${author.title}`,
                    }}
                  />
                </Link>
              </p>
            )}
            {post.date && (
              <p className="text-[17px] leading-17">
                {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                <span className="hidden md:inline">· </span>
                {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                {t('search.published')} {getFormattedDate(post.date, true)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

SearchResultSponsoredTeaser.propTypes = {
  post: PropTypes.object,

  author: PropTypes.object,
};

export default SearchResultSponsoredTeaser;
