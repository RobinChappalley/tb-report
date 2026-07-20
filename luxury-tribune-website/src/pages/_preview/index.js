import React, { useEffect, useState } from 'react';
import { getPreview } from 'client/client';
import PropTypes from 'prop-types';

import Layout from 'components/Layout';
import Page from 'components/Page';

const Preview = ({ id, wpnonce }) => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    const getPreviewContent = async () => {
      const preview = await getPreview({ 'X-Wp-Nonce': wpnonce })({ id });

      setContent(preview.post.revisions.nodes[0]);
    };

    getPreviewContent();
  }, []);

  return <Layout>{content && <Page content={content} isPreview />}</Layout>;
};

Preview.propTypes = {
  id: PropTypes.string,
  wpnonce: PropTypes.string,
};

export async function getServerSideProps({ query }) {
  const { id, wpnonce } = query;

  return {
    props: { id, wpnonce },
  };
}

export default Preview;
