import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import PropTypes from 'prop-types';

import sanitizeUrl, { isLocalLink } from 'utils/sanitizeUrl';

const RelatedLink = ({ relatedLink, attributes }) => {
  const [t] = useTranslation();

  // Handle ACF data structure
  let linkData = null;

  if (attributes?.data) {
    const data =
      typeof attributes.data === 'string'
        ? JSON.parse(attributes.data)
        : attributes.data;
    linkData = data.link || null;
  } else if (relatedLink?.link) {
    linkData = relatedLink.link;
  }

  // Fallback to default if no valid data
  if (!linkData) {
    linkData = {
      target: null,
      title: 'Titre du lien',
      url: '#',
    };
  }

  return (
    <div className="content-container card-white related-link">
      <p className="font-soehnekraftig">{t('relatedLinks.alsoRead')}</p>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      {isLocalLink(linkData.url) && (
        <Link
          href={sanitizeUrl(linkData.url)}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: linkData.title }}
          className="font-soehnekraftig"
        />
      )}
      {!isLocalLink(linkData.url) && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <a
          href={sanitizeUrl(linkData.url)}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: linkData.title }}
          className="font-soehnekraftig"
        />
      )}
    </div>
  );
};

RelatedLink.propTypes = {
  relatedLink: PropTypes.object,
  attributes: PropTypes.object,
};

RelatedLink.defaultProps = {
  relatedLink: {
    link: {
      target: null,
      title: 'Titre du lien',
      url: '#',
    },
  },
};

export default RelatedLink;
