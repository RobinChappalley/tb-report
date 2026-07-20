import React from 'react';
import PropTypes from 'prop-types';

import AdComponent from 'components/Ad';

const Ad = ({ attributes }) => (
  <>
    {/* If not right align (center) and we have an ads for this format */}
    {attributes.adAlign !== 'right' &&
      attributes.adsData &&
      attributes.adsData['480_320'] && (
        <div className="content-container">
          <AdComponent
            ad={attributes.adsData['480_320']}
            format="480_320"
            area="article"
          />
        </div>
      )}

    {/* If  right align and we have an ads for this format */}
    {attributes.adAlign === 'right' &&
      attributes.adsData &&
      attributes.adsData['300_250'] && (
        <div className="content-container">
          <AdComponent
            ad={attributes.adsData['300_250']}
            format="300_250"
            area="article"
          />
        </div>
      )}
  </>
);

Ad.propTypes = {
  attributes: PropTypes.object,
};

export default Ad;
