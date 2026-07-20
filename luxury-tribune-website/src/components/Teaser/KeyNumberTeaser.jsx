/* eslint-disable react/no-danger */
import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';

import { KeyNumber } from 'components/blocks/KeyNumbers/KeyNumbers';
import resolveCategory from 'utils/resolveCategory';
import sanitizeSlug from 'utils/sanitizeSlug';

const KeyNumberTeaser = ({ post }) => (
  <div style={{ paddingTop: '1.6rem' }}>
    <div className="card-white">
      {post.teaserOptions.keynumber.value && (
        <div className="mb-25">
          <KeyNumber number={post.teaserOptions.keynumber} />
        </div>
      )}
      <h3 className="font-miloSerif text-21">
        {post.categories && (
          <span
            className="text-orange uppercase text-13 font-soehneKraftig tracking-wider leading-17"
            dangerouslySetInnerHTML={{
              __html: resolveCategory(post.categories.nodes)?.name,
            }}
          />
        )}
        {!isEmpty(post.types.nodes) && (
          <span
            className="uppercase text-15 font-soehneKraftig tracking-wider leading-20 border-l border-solid border-sand-700 pl-5 ml-5"
            dangerouslySetInnerHTML={{ __html: post.types.nodes[0].name }}
          />
        )}
        <Link
          href={sanitizeSlug(post.uri)}
          className="hover:border-b border-solid border-brown-800"
        >
          <span
            className="ml-5"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
        </Link>
      </h3>
    </div>
  </div>
);

KeyNumberTeaser.propTypes = {
  post: PropTypes.object,
};

export default KeyNumberTeaser;
