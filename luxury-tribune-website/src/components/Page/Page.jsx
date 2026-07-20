import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import Lead from 'components/blocks/Lead';
import gtm from 'services/google-tag-manager';
import resolveBlocksComponents from 'utils/resolveBlocksComponents';

const Page = ({ content, withoutTitle, isPreview }) => {
  const { asPath } = useRouter();
  useEffect(() => {
    if (content) {
      gtm.dl({
        content_type: 'page',
      });
      gtm.event('PageView', {
        page_path: asPath,
        page_title: content.title,
      });
    }
  }, [asPath, content]);

  return (
    <div className="mx-15 md:mx-0">
      {!withoutTitle && (
        <div className="content-container !mt-30 md:!mt-50 flow-root">
          {/* eslint-disable-next-line react/no-danger */}
          <h1 dangerouslySetInnerHTML={{ __html: content.title }} />
          {content.lead && <Lead lead={content.lead.lead} />}
        </div>
      )}
      {content.editorBlocks &&
        resolveBlocksComponents(
          content.editorBlocks,
          true,
          false,
          isPreview
        ).map(({ component, props }, i) =>
          React.createElement(component, { key: i, ...props })
        )}
    </div>
  );
};

Page.propTypes = {
  content: PropTypes.object.isRequired,
  withoutTitle: PropTypes.bool,
  isPreview: PropTypes.bool,
};

Page.defaultProps = {
  isPreview: false,
};

export default Page;
