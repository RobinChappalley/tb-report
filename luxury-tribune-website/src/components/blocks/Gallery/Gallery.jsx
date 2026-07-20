import React from 'react';
import PropTypes from 'prop-types';

const Gallery = ({ innerBlocks, attributes }) => (
  <div className="content-container my-30 md:my-50">
    <div className="gallery">
      {innerBlocks.map(({ attributes: image }, index) => (
        <figure key={index}>
          <img src={image.url} alt={image.alt} />
          {image.caption && <figcaption>{image.caption}</figcaption>}
        </figure>
      ))}
    </div>
    {attributes.caption && (
      <div
        className="font-soehneLeicht text-15 leading-22 mt-10"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: attributes.caption }}
      />
    )}
  </div>
);

Gallery.propTypes = {
  innerBlocks: PropTypes.array,
  attributes: PropTypes.object,
};

Gallery.defaultProps = {
  innerBlocks: [],
  attributes: {},
};

export default Gallery;
