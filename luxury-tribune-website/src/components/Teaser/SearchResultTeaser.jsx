import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { isEmpty, isNil } from 'ramda';

import FadeInImage from 'components/FadeInImage';
import gtm from 'services/google-tag-manager';
import getDate from 'utils/getDate';
import resolveCategory from 'utils/resolveCategory';
import sanitizeSlug from 'utils/sanitizeSlug';

const SearchResultTeaser = ({ post, author, gtmPostTitle }) => {
  const { t, i18n } = useTranslation();
  const getFormattedDate = getDate(
    i18n.language === 'fr' ? 'd MMMM yyyy' : 'MMMM d, yyyy'
  );

  const handleClick = () => {
    if (!isNil(gtmPostTitle)) {
      gtm.dl({
        click_url: post.uri,
        page_title: gtmPostTitle,
      });
      gtm.event('article_click');
    }
  };

  return (
    <div className="flex space-x-10 md:space-x-30">
      {post.featuredImage?.node && (
        <Link
          href={sanitizeSlug(post.uri)}
          onClick={handleClick}
          className="w-1/3"
        >
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
      <div className={clsx(!isNil(post.featuredImage?.node) && 'w-2/3')}>
        <div className="flex items-center">
          <div>
            {post?.premium?.isPremium && (
              <span
                className="text-gold text-11 md:text-12 uppercase font-soehneKraftig tracking-wider leading-16 mr-10  border-solid border border-gold flex items-center "
                style={{ padding: '1px 4px' }}
              >
                {t('subscription.post.abbr')}
              </span>
            )}
          </div>
          <div className="flex items-center divide-x divide-sand-700">
            {post.categories && (
              <span
                className="max-w-2/5 sm:max-w-none block text-orange uppercase font-soehneKraftig tracking-wider leading-16 text-11 md:text-13 mr-5"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: resolveCategory(post.categories.nodes)?.name,
                }}
              />
            )}
            {!isEmpty(post.types.nodes) && (
              <span
                className="uppercase font-soehneKraftig tracking-wider leading-17 pl-5 text-11 md:text-13"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: post.types.nodes[0].name }}
              />
            )}
          </div>
        </div>
        <h3 className="text-21 leading-31 md:text-30 md:leading-40 md:tracking-tight mt-1.25 md:mt-5">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <Link
            href={sanitizeSlug(post.uri)}
            className="border-b border-solid border-transparent hover:border-brown-800 transition-all"
            onClick={handleClick}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
        </h3>
        <div
          className="text-19 leading-26 mt-15 hidden md:block"
          // eslint-disable-next-line react/no-danger
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
                    // eslint-disable-next-line react/no-danger
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

SearchResultTeaser.propTypes = {
  post: PropTypes.object,
  gtmPostTitle: PropTypes.string,
  author: PropTypes.object,
};

export default SearchResultTeaser;
