import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import FadeInImage from 'components/FadeInImage';
import Icon from 'components/Icon';

const Author = ({ content }) => {
  const { t } = useTranslation();

  return (
    <div className="mx-15 md:mx-0">
      <div className="content-container mt-30 md:mt-50 flow-root relative">
        <div
          className="rounded-full xl:absolute mb-20 xl:mb-0"
          style={{ width: '180px', height: '180px', left: '-40%' }}
        >
          <FadeInImage
            src={
              content.authorMetadatas.avatar?.node
                ? content.authorMetadatas.avatar.node.sourceUrl
                : '/avatar.png'
            }
            alt={content.title}
            width={1}
            height={1}
            className="rounded-full"
          />
        </div>
        {/* eslint-disable react/no-danger */}
        <h1 dangerouslySetInnerHTML={{ __html: content.title }} />
        <h2 className="lead mt-5">{content.authorMetadatas.subtitle}</h2>
        <div className="content-container mt-10 md:mt-20 rich-text">
          {/* eslint-disable react/no-danger */}
          <div
            dangerouslySetInnerHTML={{
              __html: content.authorMetadatas.biography,
            }}
          />
        </div>
        {content.authorMetadatas.links && (
          <div className="flex mt-30">
            {content.authorMetadatas.links.map((link, index) => (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                key={`link-${index}`}
                className="uppercase text-13 font-soehneKraftig leading-17 text-brown-800 mr-20"
              >
                {link.label}
                <Icon
                  name="arrow-link"
                  className="!text-10 !text-orange !ml-5"
                />
              </a>
            ))}
          </div>
        )}
        {content.authorMetadatas.more && (
          <div className="rich-text content-container mt-20 md:mt-40">
            <div
              dangerouslySetInnerHTML={{ __html: content.authorMetadatas.more }}
            />
          </div>
        )}

        {content.authorMetadatas.references && (
          <div className="mt-30">
            <h3 className="font-soehneKraftig text-21 leading-31 pb-25 border-b border-sand-500">
              {t('author.references.title')}
            </h3>
            {content.authorMetadatas.references.map((reference, index) => (
              <div
                key={`reference-${index}`}
                className="mt-20 pb-20 border-b border-sand-500"
              >
                <p className="font-miloSerif text-21 leading-31">
                  {reference.title}
                </p>
                <p className="font-soehneLeicht text-15 leading-22 mt-5">
                  {reference.referenceAuthors}
                </p>
                <p className="font-soehneLeicht text-15 leading-22 text-brown-500">
                  {reference.publication}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Author.propTypes = {
  content: PropTypes.object.isRequired,
};

export default Author;
