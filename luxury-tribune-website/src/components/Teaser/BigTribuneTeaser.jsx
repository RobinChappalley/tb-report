/* eslint-disable react/no-danger */
import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import PropTypes from 'prop-types';

import FadeInImage from 'components/FadeInImage';
import Icon from 'components/Icon';
import sanitizeSlug from 'utils/sanitizeSlug';

const BigTribuneTeaser = ({ post, author }) => {
  const { t } = useTranslation();

  return (
    <div className="mx-15 lg:mx-0 card-white">
      {author && (
        <div className="w-80 h-80 relative" style={{ top: '-71px' }}>
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
              __html: post.categoryName,
            }}
          />
        </div>
      </div>
      <h2 className="mt-10">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <Link
          href={sanitizeSlug(post.post.uri)}
          className="hover:border-b border-solid border-brown-800"
          dangerouslySetInnerHTML={{ __html: post.post.title }}
        />
      </h2>
      <div
        className="mt-15 inline"
        dangerouslySetInnerHTML={{ __html: post.post.excerpt }}
      />
      <Link
        href={sanitizeSlug(post.post.uri)}
        className="inline uppercase font-soehneKraftig text-15 text-orange tracking-wide hover:border-b border-solid border-orange"
      >
        {`${t('featured.read_more')} `}
        <Icon className="!text-15" name="arrow" />
      </Link>
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
  );
};

BigTribuneTeaser.propTypes = {
  post: PropTypes.object,
  author: PropTypes.object,
};

BigTribuneTeaser.defaultProps = {};

export default BigTribuneTeaser;
