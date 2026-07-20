import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';

const Footnotes = ({ footnotes }) => {
  const [t] = useTranslation();

  return (
    <div
      className="content-container mb-30 mt-30 md:mt-50"
      id="footnote-content"
    >
      <h4 className="text-15 uppercase leading-20 tracking-wide font-soehneKraftig mb-20">
        {t('footnotes.references')}
      </h4>
      <ul>
        {footnotes.footnotes.map(({ content, link }, index) => (
          <li className="list-none mb-10 flex items-baseline" key={index}>
            <span className="flex-shrink-0 footnote-content">{index + 1}</span>
            <p className="font-soehneLeicht text-15 leading-22">
              <span>{`${content} `}</span>
              {link && (
                // eslint-disable-next-line jsx-a11y/control-has-associated-label
                <a
                  href={link.url}
                  target={link.target}
                  className="border-b border-brown-800 border-solid"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: link.title }}
                />
              )}
              <a href={`#footnote-${index + 1}`}>
                <Icon
                  name="arrow-link"
                  className="text-10 text-brown-800 ml-5"
                />
              </a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

Footnotes.propTypes = {
  footnotes: PropTypes.object,
};

Footnotes.defaultProps = {
  footnotes: {
    footnotes: [
      {
        content: 'Footnote content',
        link: {
          target: null,
          url: '#',
          title: '',
        },
      },
    ],
  },
};

export default Footnotes;
