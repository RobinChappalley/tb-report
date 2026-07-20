import { find, findIndex, propEq, remove } from 'ramda';

import { wpBlocks } from '../config/config';

const ExtractFirstLead = page => {
  // Return page as-is if blocks is undefined (when blocks are disabled)
  if (!page.blocks) {
    return page;
  }

  const firstLead = find(propEq('name', wpBlocks.lead), page.blocks);

  if (!firstLead) {
    return page;
  }

  return {
    ...page,
    lead: firstLead,
    blocks: remove(
      findIndex(propEq(wpBlocks.lead, 'name'), page.blocks),
      1,
      page.blocks
    ),
  };
};
export default ExtractFirstLead;
