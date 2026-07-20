import React from 'react';
import { useTranslation } from 'react-i18next';

import Icon from 'components/Icon';

const SocialNetworks = () => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-15">
      <a
        className="flex"
        href={t('header.socials.linkedin')}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="linkedin" size="smaller" />
      </a>
      <a
        className="flex"
        href={t('header.socials.instagram')}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="instagram" size="smaller" />
      </a>
      <a
        className="flex"
        href={t('header.socials.youtube')}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="youtube" size="smaller" />
      </a>
      <a
        className="flex"
        href={t('header.socials.tiktok')}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="tiktok" size="smaller" />
      </a>
      <a
        className="flex"
        href={t('header.socials.whatsapp')}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="whatsapp" size="smaller" />
      </a>
    </div>
  );
};

export default SocialNetworks;
