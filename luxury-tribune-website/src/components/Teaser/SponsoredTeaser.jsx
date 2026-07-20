/* eslint-disable react/no-danger */
import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import FadeInImage from 'components/FadeInImage';
import resolveCategory from 'utils/resolveCategory';
import sanitizeSlug from 'utils/sanitizeSlug';

const SponsoredTeaser = ({ post, mini, author }) => {
  const { t } = useTranslation();

  return (
    <div className={clsx(mini && 'mini-teaser')}>
      {post.featuredImage?.sourceUrl && (
        <Link href={sanitizeSlug(post.uri)}>
          <figure
            className="hover:opacity-90"
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
      <div className="bg-sand-300 p-20 pt-15">
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
              className={clsx(
                'text-orange uppercase font-soehneKraftig tracking-wider leading-17',
                mini ? 'text-12' : 'text-13'
              )}
              dangerouslySetInnerHTML={{
                __html: resolveCategory(post.categories.nodes)?.name,
              }}
            />
          )}
          <span
            style={{ paddingTop: '2px' }}
            className={clsx(
              'uppercase font-soehneKraftig tracking-wider leading-17 border-l border-solid border-sand-700 pl-5 ml-5',
              mini ? 'text-12' : 'text-13'
            )}
          >
            {t('post.sponsor')}
          </span>
        </div>
        <h3
          className={clsx(mini ? 'text-21 leading-31' : 'text-25 leading-35')}
        >
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <Link
            href={sanitizeSlug(post.uri)}
            className="hover:border-b border-solid border-brown-800"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
        </h3>
        <div
          className={clsx(
            mini ? 'text-15 leading-22 mt-10' : 'text-19 leading-26 mt-15'
          )}
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        {author && (
          <p
            className={clsx(
              'flex-grow',
              mini ? 'text-15 mt-5' : 'text-19 mt-15'
            )}
          >
            By
            <Link href={sanitizeSlug(author.uri)}>
              <span
                className={clsx(
                  'font-soehneKraftig uppercase tracking-wide',
                  mini ? 'text-13 leading-17' : 'text-15 leading-20'
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

SponsoredTeaser.propTypes = {
  post: PropTypes.object,
  mini: PropTypes.bool,
  author: PropTypes.object,
};

SponsoredTeaser.defaultProps = {
  mini: false,
};

export default SponsoredTeaser;
