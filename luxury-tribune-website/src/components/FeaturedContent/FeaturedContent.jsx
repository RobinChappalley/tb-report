/* eslint-disable react/no-danger */
import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { evolve, find, pathOr, propEq, take } from 'ramda';

import Ad from 'components/Ad';
import KeyNumbers from 'components/blocks/KeyNumbers/KeyNumbers';
import FadeInImage from 'components/FadeInImage';
import BigTribuneTeaser from 'components/Teaser/BigTribuneTeaser';
import resolveCategory from 'utils/resolveCategory';
import sanitizeSlug from 'utils/sanitizeSlug';

const FeaturedContent = ({ featuredPost, lastTribune, ad }) => {
  const { t } = useTranslation();

  const keyNumbersBlock = pathOr(false, ['blocks'], featuredPost)
    ? find(propEq('acf/key-numbers', 'name'), featuredPost.blocks)
    : null;

  return (
    <div className="featured-content">
      {featuredPost && (
        <div>
          {featuredPost.featuredImage?.sourceUrl && (
            <Link href={sanitizeSlug(featuredPost.uri)}>
              <figure>
                <p>
                  <span
                    style={{ position: 'relative', top: '-3px' }}
                    dangerouslySetInnerHTML={{
                      __html: t('featured.featured'),
                    }}
                  />
                </p>
                <div className="img-container">
                  <FadeInImage
                    src={featuredPost.featuredImage?.sourceUrl}
                    alt={featuredPost.title}
                    width={16}
                    height={9}
                  />
                </div>
              </figure>
            </Link>
          )}
        </div>
      )}
      <div className="md:flex justify-between items-start">
        {featuredPost && (
          <div className="featured-post">
            <div>
              <div className="inline-flex">
                {featuredPost?.premium?.isPremium && (
                  <span
                    className="text-15 text-gold uppercase font-soehneKraftig tracking-wide leading-20 mr-10  border-solid border border-gold flex items-center"
                    style={{ padding: '2px 6px' }}
                  >
                    {t('subscription.post.abbr')}
                  </span>
                )}
                <p
                  className="text-orange uppercase font-soehneKraftig text-15 tracking-wide leading-20"
                  style={{ paddingTop: '2px' }}
                  dangerouslySetInnerHTML={{
                    __html: resolveCategory(featuredPost.categories.nodes)
                      ?.name,
                  }}
                />
              </div>
              <h1>
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <Link
                  href={sanitizeSlug(featuredPost.uri)}
                  className="hover:border-b border-solid border-brown-800"
                  dangerouslySetInnerHTML={{ __html: featuredPost.title }}
                />
              </h1>
              <div
                className="lead mt-25 md:mt-30"
                dangerouslySetInnerHTML={{ __html: featuredPost.excerpt }}
              />
            </div>

            {keyNumbersBlock && (
              <KeyNumbers
                keyNumber={
                  evolve(
                    { keyNumber: { keyNumbers: take(3) } },
                    keyNumbersBlock
                  ).keyNumber
                }
                featured
              />
            )}
            <Link
              href={sanitizeSlug(featuredPost.uri)}
              className="mt-20 md:mt-30 btn btn-primary btn-normal"
            >
              {t('featured.read')}
            </Link>
          </div>
        )}
        {!ad && lastTribune && (
          <div
            className={clsx(
              'last-tribune flex',
              lastTribune && 'flex-row-reverse'
            )}
          >
            <div className="md:w-4/5">
              <BigTribuneTeaser
                post={lastTribune}
                // eslint-disable-next-line camelcase
                author={
                  lastTribune?.post?.postAuthors?.author?.edges?.[0]?.node
                }
              />
            </div>
          </div>
        )}

        {ad && <Ad ad={ad} format="480_320" area="home" />}
      </div>
    </div>
  );
};

FeaturedContent.propTypes = {
  featuredPost: PropTypes.object,
  lastTribune: PropTypes.object,
  ad: PropTypes.object,
};

FeaturedContent.defaultProps = {};

export default FeaturedContent;
