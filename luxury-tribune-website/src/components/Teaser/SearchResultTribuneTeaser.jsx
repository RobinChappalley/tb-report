/* eslint-disable react/no-danger */
import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import PropTypes from 'prop-types';

import FadeInImage from 'components/FadeInImage';
import getDate from 'utils/getDate';
import resolveCategory from 'utils/resolveCategory';
import sanitizeSlug from 'utils/sanitizeSlug';

const SearchResultTribuneTeaser = ({ post, author }) => {
  const { t, i18n } = useTranslation();
  const getFormattedDate = getDate(
    i18n.language === 'fr' ? 'd MMMM yyyy' : 'MMMM d, yyyy'
  );

  return (
    <div style={{ paddingTop: '1.6rem' }}>
      <div className="card-white flex space-x-10 md:space-x-25">
        {author && (
          <div className="w-80 h-80 relative">
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
        <div>
          <div className="inline-flex mb-5">
            {post?.premium?.isPremium && (
              <span
                className="text-12 text-gold uppercase font-soehneKraftig tracking-wider leading-16 mr-10  border-solid border border-gold flex items-center"
                style={{ padding: '0 4px' }}
              >
                {t('subscription.post.abbr')}
              </span>
            )}
            {post.categories && (
              <span
                className="text-orange uppercase text-13 font-soehneKraftig tracking-wider leading-17"
                dangerouslySetInnerHTML={{
                  __html: resolveCategory(post.categories.nodes)?.name,
                }}
              />
            )}
          </div>
          <h3 className="font-soehneKraftig text-21 leading-31 md:text-30 md:leading-40 md:tracking-tight">
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <Link
              href={sanitizeSlug(post.uri)}
              className="hover:border-b border-solid border-brown-800"
              dangerouslySetInnerHTML={{ __html: post.title }}
            />
          </h3>

          {(author || post.date) && (
            <div className="md:flex items-center mt-10 md:mt-15 space-y-[2px] md:space-y-0 md:space-x-[2px]">
              {author && (
                <p className="text-19">
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
    </div>
  );
};

SearchResultTribuneTeaser.propTypes = {
  post: PropTypes.object,
  author: PropTypes.object,
};

SearchResultTribuneTeaser.defaultProps = {};

export default SearchResultTribuneTeaser;
