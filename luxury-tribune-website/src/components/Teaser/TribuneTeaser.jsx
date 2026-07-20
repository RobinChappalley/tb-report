/* eslint-disable react/no-danger */
import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import PropTypes from 'prop-types';

import FadeInImage from 'components/FadeInImage';
import resolveCategory from 'utils/resolveCategory';
import sanitizeSlug from 'utils/sanitizeSlug';

const TribuneTeaser = ({ post, author }) => {
  const { t } = useTranslation();

  return (
    <div style={{ paddingTop: '4.6rem' }}>
      <div className="card-white">
        {author && (
          <div className="relative w-80 h-80" style={{ top: '-66px' }}>
            <FadeInImage
              src={
                author.authorMetadatas.avatar?.node
                  ? author.authorMetadatas.avatar.node.sourceUrl
                  : '/avatar.png'
              }
              alt={`${author.title}`}
              width={1}
              height={1}
              className="rounded-full"
            />
          </div>
        )}
        <div style={{ marginTop: '-51px' }}>
          <div className="inline-flex">
            {post?.premium?.isPremium && (
              <span
                className="flex items-center mr-10 tracking-wider uppercase border border-solid text-12 text-gold font-soehneKraftig leading-16 border-gold"
                style={{ padding: '1px 4px' }}
              >
                {t('subscription.post.abbr')}
              </span>
            )}
            {post.categories && (
              <span
                className="tracking-wider uppercase text-orange text-13 font-soehneKraftig leading-17"
                style={{ paddingTop: '2px' }}
                dangerouslySetInnerHTML={{
                  __html: resolveCategory(post.categories.nodes)?.name,
                }}
              />
            )}
          </div>
          <h3 className="font-soehneKraftig">
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <Link
              href={sanitizeSlug(post.uri)}
              className="border-solid hover:border-b border-brown-800"
              dangerouslySetInnerHTML={{ __html: post.title }}
            />
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          </h3>
          {author && (
            <p className="flex-grow text-19 mt-15">
              By
              <Link href={sanitizeSlug(author.uri)}>
                <span
                  className="tracking-wide uppercase font-soehneKraftig text-15 leading-20"
                  dangerouslySetInnerHTML={{
                    __html: ` ${author.title}`,
                  }}
                />
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

TribuneTeaser.propTypes = {
  post: PropTypes.object,
  author: PropTypes.object,
};

TribuneTeaser.defaultProps = {};

export default TribuneTeaser;
