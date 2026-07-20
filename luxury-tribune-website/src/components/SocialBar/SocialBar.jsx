import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';

const SocialBar = ({ socialInfos }) => (
  <div className="social-bar">
    {socialInfos.map(
      (socialInfo, index) =>
        socialInfo.url ? (
          <a
            href={socialInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            key={index}
          >
            <Icon name={socialInfo.label.toLowerCase()} />
          </a>
        ) : null,
      socialInfos
    )}
  </div>
);

SocialBar.propTypes = {
  socialInfos: PropTypes.array,
};

SocialBar.defaultProps = {
  socialInfos: [],
};

export default SocialBar;
