import React from 'react';
import PropTypes from 'prop-types';

import FadeInImage from 'components/FadeInImage';

const Image = ({ attributes }) => {
  const availableSizes = {
    'is-style-default': 'img-style-default',
    'is-style-large-image': 'img-style-large',
    'is-style-full-width': 'img-style-full',
  };

  const figureStyle =
    availableSizes[attributes.className] || 'img-style-default';

  const availableAligns = {
    left: 'img-align-left',
    right: 'img-align-right',
  };

  return (
    <div className={figureStyle}>
      {attributes.align !== '' && (
        <figure className={availableAligns[attributes.align] || ''}>
          <ImageInner attributes={attributes} />
        </figure>
      )}
      {attributes.align === '' && (
        <figure>
          <ImageInner attributes={attributes} />
        </figure>
      )}
    </div>
  );
};

Image.propTypes = {
  attributes: PropTypes.object,
};

Image.defaultProps = {
  attributes: {
    url: 'https://placehold.it/1980x1080',
    className: 'is-style-default',
    caption: 'This is a caption',
    align: null,
    alt: 'Alternative text',
  },
};

const ImageInner = ({ attributes }) => {
  const isFullWidth = attributes.className === 'is-style-full-width';
  const isLargeImage = attributes.className === 'is-style-large-image';

  return (
    <>
      <FadeInImage
        src={attributes.url}
        alt={attributes.alt}
        className={isLargeImage ? 'img-style-large' : undefined}
        sizes={isFullWidth ? '100vw' : '50vw'}
      />
      {attributes.caption && (
        <figcaption
          className="font-soehneLeicht text-15 leading-22 mt-10"
          style={isFullWidth ? { marginLeft: '1rem' } : null}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: attributes.caption }}
        />
      )}
    </>
  );
};

ImageInner.propTypes = {
  attributes: PropTypes.object,
};

export default Image;
