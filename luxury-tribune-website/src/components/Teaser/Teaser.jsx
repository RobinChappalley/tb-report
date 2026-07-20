/* eslint-disable react/no-danger */
import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { isEmpty, isNil } from 'ramda';

import FadeInImage from 'components/FadeInImage';
import gtm from 'services/google-tag-manager';
import resolveCategory from 'utils/resolveCategory';
import sanitizeSlug from 'utils/sanitizeSlug';

const Teaser = ({
  post,
  mini,
  author,
  gtmPostTitle,
  customMobileDisplay = false,
}) => {
  const { t } = useTranslation();

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
    <div
      className={clsx(
        mini && 'mini-teaser',
        customMobileDisplay &&
          'flex md:block pb-12.5 md:pb-0 border-b md:border-none border-solid border-sand-500 space-x-10 md:space-x-0'
      )}
    >
      {post.featuredImage?.sourceUrl && (
        <Link
          href={sanitizeSlug(post.uri)}
          onClick={handleClick}
          className={clsx(customMobileDisplay && 'w-1/3 md:w-auto')}
        >
          <figure
            className={clsx(
              'hover:opacity-90',
              customMobileDisplay ? 'md:mb-20' : 'mb-20'
            )}
            style={{ transition: '0.15s opacity' }}
          >
            {!isNil(post?.teaserOptions) &&
              post.teaserOptions.imageFormat === 'square' && (
                <div className={post.teaserOptions.imageFormat}>
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
              post.teaserOptions.imageFormat === 'portrait' && (
                <div className={post.teaserOptions.imageFormat}>
                  <FadeInImage
                    src={post.featuredImage?.sourceUrl}
                    alt={post.title}
                    width={10}
                    height={13}
                    className="object-cover"
                  />
                </div>
              )}
            {(isNil(post?.teaserOptions) ||
              post.teaserOptions.imageFormat === 'landscape') && (
              <div className="landscape">
                <FadeInImage
                  src={post.featuredImage?.sourceUrl}
                  alt={post.title}
                  width={3}
                  height={2}
                  className="object-cover"
                />
              </div>
            )}
          </figure>
        </Link>
      )}
      <div
        className={clsx(
          'md:pb-10 md:border-b border-solid border-sand-500',
          customMobileDisplay && 'w-2/3 md:w-auto',
          mini && 'md:pb-20'
        )}
      >
        <div className="flex">
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
          {post.categories && (
            <span
              style={{ paddingTop: '2px' }}
              className={clsx(
                'text-orange uppercase font-soehneKraftig tracking-wider leading-17',
                mini && !customMobileDisplay ? 'text-12' : 'text-13',
                mini && customMobileDisplay && 'text-11 md:text-12',
                !mini && customMobileDisplay && 'text-11 md:text-13'
              )}
              dangerouslySetInnerHTML={{
                __html: resolveCategory(post.categories.nodes)?.name,
              }}
            />
          )}
          {!isEmpty(post.types.nodes) && (
            <span
              style={{ paddingTop: '2px' }}
              className={clsx(
                'uppercase font-soehneKraftig tracking-wider leading-17 border-l border-solid border-sand-700 pl-5 ml-5',
                mini && !customMobileDisplay ? 'text-12' : 'text-13',
                mini && customMobileDisplay && 'text-11 md:text-12',
                !mini && customMobileDisplay && 'text-11 md:text-13'
              )}
              dangerouslySetInnerHTML={{ __html: post.types.nodes[0].name }}
            />
          )}
        </div>
        <Link
          href={sanitizeSlug(post.uri)}
          className={clsx(
            'border-b border-solid border-transparent hover:border-brown-800 transition-all',
            customMobileDisplay && 'mt-1.25 md:mt-0'
          )}
          onClick={handleClick}
        >
          <h3
            className={clsx(
              'sm:mt-[5px]',
              mini && !customMobileDisplay
                ? 'text-21 leading-31'
                : 'text-25 leading-35',
              mini &&
                customMobileDisplay &&
                'text-18 md:text-21 leading-24 md:leading-31 mt-1.25',
              !mini &&
                customMobileDisplay &&
                'text-18 md:text-25 leading-24 md:leading-35'
            )}
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
        </Link>
        <div
          className={clsx(
            mini ? 'text-15 leading-22 mt-10' : 'text-19 leading-26 mt-15',
            customMobileDisplay && 'hidden md:block'
          )}
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        {author && (
          <p
            className={clsx(
              'flex-grow',
              mini && !customMobileDisplay ? 'text-15 mt-5' : 'text-19 mt-15',
              mini &&
                customMobileDisplay &&
                'text-16 md:text-15 mt-5 leading-16 md:leading-none',
              !mini &&
                customMobileDisplay &&
                'text-16 md:text-19 mt-5 md:mt-15 leading-16 md:leading-none'
            )}
          >
            By
            <Link href={sanitizeSlug(author.uri)}>
              <span
                className={clsx(
                  'uppercase tracking-wide',
                  mini && !customMobileDisplay
                    ? 'text-13 leading-17 font-soehneKraftig'
                    : 'text-15 leading-20 font-soehneKraftig',
                  mini &&
                    customMobileDisplay &&
                    'text-12 md:text-13 leading-17',
                  !mini &&
                    customMobileDisplay &&
                    'text-12 md:text-15 md:leading-20'
                )}
                dangerouslySetInnerHTML={{
                  __html: ` ${author.title}`,
                }}
              />
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

Teaser.propTypes = {
  mini: PropTypes.bool,
  post: PropTypes.object,
  author: PropTypes.object,
  gtmPostTitle: PropTypes.string,
  customMobileDisplay: PropTypes.bool,
};

Teaser.defaultProps = {
  mini: false,
  gtmPostTitle: null,
};

export default Teaser;
