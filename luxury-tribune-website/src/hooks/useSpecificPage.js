import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { isNil } from 'ramda';

import config from 'config/config';
import { editorBlocksContent, translations } from 'hooks/usePostOrPage';

const SPECIFICPAGE = 'specificPage';

const getSpecificPage = async slug => {
  const { page } = await request(
    config.apiHost,
    gql`
    query GetSpecificPage {
      page(id: "${slug}", idType: URI) {
        title
        date
        ${translations}
        ${editorBlocksContent}
      }
    }
    `
  );

  return page;
};

export const prefetchSpecificPage = slug => [
  [SPECIFICPAGE, slug],
  () => getSpecificPage(slug),
  { enabled: !isNil(slug) },
];

const useSpecificPage = slug =>
  useQuery([SPECIFICPAGE, slug], () => getSpecificPage(slug), {
    enabled: !isNil(slug),
  });

export default useSpecificPage;
