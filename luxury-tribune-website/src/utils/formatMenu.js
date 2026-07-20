import { curry, includes, isEmpty, isNil } from 'ramda';

import { specificPages } from 'config/config';
import { defaultLng } from 'locales/languages';
import sanitizeSlug from 'utils/sanitizeSlug';

export default curry((lng, asPath, menu) => {
  if (isNil(menu?.nodes) || isEmpty(menu?.nodes)) {
    return [];
  }

  const getType = ({ __typename, uri }) => {
    const types = {
      Page: includes(uri, specificPages) ? sanitizeSlug(uri) : '/[...slug]',
      Post: '/[...slug]',
      Category: `${lng === defaultLng ? '' : `/en`}/category/[category]`,
      Type: `${lng === defaultLng ? '' : `/en`}/type/[type]`,
    };

    return types[__typename] || '/[...slug]';
  };

  return menu.nodes.map(({ label, connectedObject }) => ({
    label,
    href: getType(connectedObject),
    as: sanitizeSlug(connectedObject.uri),
    active: asPath === `${sanitizeSlug(connectedObject.uri)}`,
  }));
});
