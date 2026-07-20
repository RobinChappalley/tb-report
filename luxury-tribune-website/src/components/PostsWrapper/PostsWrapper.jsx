import React from 'react';
import { useTranslation } from 'react-i18next';
import Masonry from 'react-masonry-css';
import PropTypes from 'prop-types';

import Teaser from 'components/Teaser/Teaser';
import resolveTeaser from 'utils/resolveTeaser';

import NewsTeaser from '../Teaser/NewsTeaser';

const PostsWrapper = ({ posts, pageInfo, onMoreClicked, mini, isNews }) => {
  const { t, i18n } = useTranslation();

  const components = posts?.map(resolveTeaser(i18n.language));

  const cols = {
    default: mini ? 4 : 3,
    1023: 2,
    767: 1,
  };

  return (
    <div className="px-15 xl:px-0">
      <Masonry
        breakpointCols={cols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {isNews &&
          components.map(({ post }, i) =>
            React.createElement(NewsTeaser, {
              key: i,
              post,
            })
          )}
        {!isNews &&
          components?.map(({ post, author, component }, i) =>
            React.createElement(mini ? Teaser : component, {
              key: i,
              post,
              mini,
              author,
              customMobileDisplay: true,
            })
          )}
      </Masonry>
      {pageInfo?.hasNextPage && (
        <button
          type="button"
          className="mt-30 mx-auto !block btn btn-normal btn-secondary"
          onClick={onMoreClicked}
        >
          {t('more_posts')}
        </button>
      )}
    </div>
  );
};

PostsWrapper.propTypes = {
  posts: PropTypes.array,
  pageInfo: PropTypes.object,
  onMoreClicked: PropTypes.func,
  mini: PropTypes.bool,
  isNews: PropTypes.bool,
};

PostsWrapper.defaultProps = {
  pageInfo: {},
  mini: false,
};

export default PostsWrapper;
