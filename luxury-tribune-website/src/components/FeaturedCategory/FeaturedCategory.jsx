/* eslint-disable react/no-danger */
import React from 'react';
import { useTranslation } from 'react-i18next';
import Masonry from 'react-masonry-css';
import he from 'he';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { slice } from 'ramda';

import FadeInImage from 'components/FadeInImage';
import Icon from 'components/Icon';
import SponsoredTeaser from 'components/Teaser/SponsoredTeaser';
import Teaser from 'components/Teaser/Teaser';
import resolveCategory from 'utils/resolveCategory';
import sanitizeSlug from 'utils/sanitizeSlug';

const FeaturedCategory = ({ category, icon }) => {
  const firstPost = category.posts[0];
  // eslint-disable-next-line camelcase
  const author = firstPost?.postAuthors?.author?.edges?.[0]?.node;
  const otherPosts = slice(1, Infinity, category.posts);
  const { t } = useTranslation();

  return (
    <div className="px-15 xl:px-0">
      <h2 className="uppercase mb-15 md:mb-25 pb-15 border-b border-sand-500">
        <Icon
          name={icon}
          className="!text-orange !text-19 md:!text-25 !mr-10"
        />
        <span>{he.decode(category.name)}</span>
      </h2>
      <div className="md:grid grid-cols-2 gap-30">
        <div className="first-post">
          {firstPost.featuredImage?.sourceUrl && (
            <Link href={sanitizeSlug(firstPost.uri)}>
              <figure>
                <FadeInImage
                  src={firstPost.featuredImage?.sourceUrl}
                  alt={firstPost.title}
                  width={3}
                  height={2}
                />
              </figure>
            </Link>
          )}
          <div className="inline-flex mt-30">
            {firstPost?.premium?.isPremium && (
              <span
                className="text-15 text-gold uppercase font-soehneKraftig tracking-wide leading-20 mr-10  border-solid border border-gold"
                style={{ padding: '2px 6px' }}
              >
                {t('subscription.post.abbr')}
              </span>
            )}
            <p
              className="text-orange uppercase font-soehneKraftig text-15 tracking-wide leading-20"
              style={{ paddingTop: '2px' }}
              dangerouslySetInnerHTML={{
                __html: resolveCategory(firstPost.categories.nodes)?.name,
              }}
            />
          </div>
          <h1>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <Link
              href={sanitizeSlug(firstPost.uri)}
              className="border-b border-solid border-transparent hover:border-brown-800 transition-all"
              dangerouslySetInnerHTML={{ __html: firstPost.title }}
            />
          </h1>
          <div
            className="lead mt-25 md:mt-30"
            dangerouslySetInnerHTML={{ __html: firstPost.excerpt }}
          />
          {author && (
            <p className="flex-grow text-19 mt-15">
              By
              <Link href={sanitizeSlug(author.uri)}>
                <span
                  className="font-soehneKraftig text-15 leading-20 uppercase tracking-wide"
                  dangerouslySetInnerHTML={{
                    __html: ` ${author.title}`,
                  }}
                />
              </Link>
            </p>
          )}
        </div>
        <div>
          <Masonry
            breakpointCols={{
              default: 2,
              1023: 1,
              767: 1,
            }}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {otherPosts.map((post, i) =>
              post.sponsorship.sponsored ? (
                <SponsoredTeaser
                  key={`post_teaser_${i}`}
                  post={post}
                  mini
                  // eslint-disable-next-line camelcase
                  author={post?.postAuthors?.author?.edges?.[0]?.node}
                />
              ) : (
                <Teaser
                  key={`post_teaser_${i}`}
                  post={post}
                  // eslint-disable-next-line camelcase
                  author={post?.postAuthors?.author?.edges?.[0]?.node}
                  mini
                  customMobileDisplay
                />
              )
            )}
          </Masonry>
        </div>
      </div>
    </div>
  );
};

FeaturedCategory.propTypes = {
  category: PropTypes.object,
  icon: PropTypes.string,
};

FeaturedCategory.defaultProps = {};

export default FeaturedCategory;
