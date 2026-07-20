import { isNil } from 'ramda';

const flattenQueryRes = data => {
  if (!isNil(data?.edges)) {
    const result = data.edges.map(({ node }) => ({ ...node }));
    return result;
  }
  return data;
};

export default flattenQueryRes;
