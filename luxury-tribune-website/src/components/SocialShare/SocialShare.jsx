/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';
import gtm from 'services/google-tag-manager';

const SocialShare = ({ host, contentType, title }) => {
  const { asPath } = useRouter();

  const url = `https://${host}${asPath}`;

  const handleClick = method => {
    gtm.event('share', {
      method,
      contentType,
      item_id: title,
    });
  };

  return (
    <div className="social-share">
      <FacebookShareButton url={url}>
        <div onClick={() => handleClick('facebook')}>
          <Icon name="facebook" />
        </div>
      </FacebookShareButton>
      <TwitterShareButton url={url}>
        <div onClick={() => handleClick('X (twitter)')}>
          <Icon name="twitter" />
        </div>
      </TwitterShareButton>
      <LinkedinShareButton url={url}>
        <div onClick={() => handleClick('linkedin')}>
          <Icon name="linkedin" />
        </div>
      </LinkedinShareButton>
      <EmailShareButton url={url}>
        <div onClick={() => handleClick('email')}>
          <Icon name="mail" />
        </div>
      </EmailShareButton>
      <WhatsappShareButton url={url}>
        <div onClick={() => handleClick('whatsapp')}>
          <Icon name="whatsapp" />
        </div>
      </WhatsappShareButton>
    </div>
  );
};

SocialShare.propTypes = {
  host: PropTypes.string,
  contentType: PropTypes.string,
  title: PropTypes.string,
};

export default SocialShare;
