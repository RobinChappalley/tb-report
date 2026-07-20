import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const StudyLink = ({ linkedStudy }) => {
  const { t } = useTranslation();

  // Use only GraphQL data - no need to parse ACF data
  const professors = linkedStudy?.professors?.nodes || [];

  // Determine link type and URL from GraphQL data
  const linkType = linkedStudy?.linkType || 'link';
  const href =
    linkType === 'link'
      ? linkedStudy?.url || '#'
      : linkedStudy?.file?.node?.sourceUrl || '#';

  return (
    <div className="content-container mb-50 study-link card-white">
      <p className="tracking-normal font-soehneKraftig leading-31 mb-15">
        {t('studyLink.completeStudy')}
      </p>
      <a
        target="_blank"
        rel="noreferrer noopener"
        href={href}
        className="btn btn-primary btn-normal"
      >
        {t(`studyLink.${linkType}`)}
      </a>
      <div className="mt-25 pt-25 border-t border-solid border-sand-300">
        <p className="tracking-normal font-soehneKraftig leading-31">
          {t('studyLink.professors')}
        </p>
        {professors && professors.length > 0 && (
          <div className="flex flex-wrap">
            {professors.map((professor, index) => (
              <div key={index} className="md:w-1/2 flex items-center mt-15">
                <img
                  className="w-80 h-80 rounded-full"
                  src={
                    professor?.authorMetadatas?.avatar?.node?.sourceUrl
                      ? professor.authorMetadatas.avatar.node.sourceUrl
                      : '/avatar.png'
                  }
                  alt={professor?.title || 'Professor'}
                />
                <div className="ml-15 pr-15">
                  <p
                    className="font-soehneKraftig text-15 tracking-wider uppercase leading-20"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: professor?.title || '',
                    }}
                  />
                  <p className="font-soehneLeicht text-15 leading-22">
                    {/* Organization info not available in GraphQL schema */}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

StudyLink.propTypes = {
  linkedStudy: PropTypes.object,
};

StudyLink.defaultProps = {
  linkedStudy: {
    linkType: 'link',
    url: '#',
    file: {
      node: {
        sourceUrl: '',
      },
    },
    professors: {
      nodes: [],
    },
  },
};

export default StudyLink;
