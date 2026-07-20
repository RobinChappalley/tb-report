/* eslint-disable react/no-danger */
import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import FadeInImage from 'components/FadeInImage';
import gtm from 'services/google-tag-manager';
import resolveCategory from 'utils/resolveCategory';
import sanitizeSlug from 'utils/sanitizeSlug';

const NewsTeaser = ({ post, gtmPostTitle }) => {
  const handleClick = () => {
    if (!isNil(gtmPostTitle)) {
      gtm.dl({
        click_url: post.uri,
        page_title: gtmPostTitle,
      });
      gtm.event('article_click');
    }
  };

  // Determine image format - default to landscape if teaserOptions not available
  const imageFormat = post?.teaserOptions?.imageFormat || 'landscape';

  const renderImage = () => {
    if (imageFormat === 'square') {
      return (
        <div className="square">
          <FadeInImage
            src={post.featuredImage?.sourceUrl}
            alt={post.title}
            width={1}
            height={1}
            className="object-cover"
          />
        </div>
      );
    }

    if (imageFormat === 'portrait') {
      return (
        <div className="portrait">
          <FadeInImage
            src={post.featuredImage?.sourceUrl}
            alt={post.title}
            width={10}
            height={13}
            className="object-cover"
          />
        </div>
      );
    }

    return (
      <div className="landscape">
        <FadeInImage
          src={post.featuredImage?.sourceUrl}
          alt={post.title}
          width={3}
          height={2}
          className="object-cover"
        />
      </div>
    );
  };

  return (
    <div className="flex md:block space-x-10 md:space-x-0">
      {post.featuredImage?.sourceUrl && (
        <Link
          href={sanitizeSlug(post.uri)}
          onClick={handleClick}
          className="w-1/3 md:w-auto"
        >
          <figure
            className="hover:opacity-90 md:mb-15"
            style={{ transition: '0.15s opacity' }}
          >
            {renderImage()}
          </figure>
        </Link>
      )}
      <div className="w-2/3 md:w-auto">
        {post.categories && (
          <span
            className="block text-orange uppercase font-soehneKraftig tracking-wider leading-16 text-11 md:text-13"
            dangerouslySetInnerHTML={{
              __html: resolveCategory(post.categories.nodes)?.name,
            }}
          />
        )}
        <h3 className="text-18 md:text-21 leading-24 md:leading-28 mt-1.25 md:mt-5">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <Link
            href={sanitizeSlug(post.uri)}
            className="border-b border-solid border-transparent hover:border-brown-800 transition-all"
            onClick={handleClick}
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
        </h3>
      </div>
    </div>
  );
};

NewsTeaser.propTypes = {
  post: PropTypes.object,
  gtmPostTitle: PropTypes.string,
};

export default NewsTeaser;
