import { findIndex, lensPath, propEq, replace, set } from 'ramda';

import { wpBlocks } from '../config/config';

const addFootnoteAnchor = (curr, block) => {
  let newCurr = curr;
  const blockContent = replace(
    /<a class="footnote-circle">/g,
    () => {
      const newMatch = `<a id="footnote-${newCurr}" href="#footnote-content" class="footnote-circle">`;

      newCurr += 1;

      return newMatch;
    },
    block.attributes.content
  );

  return {
    newCurr,
    blockWithAnchors: set(
      lensPath(['attributes', 'content']),
      blockContent,
      block
    ),
  };
};

const HandleFootnotesAnchors = page => {
  // Return page as-is if blocks is undefined (when blocks are disabled)
  if (!page.blocks) {
    return page;
  }

  if (!findIndex(propEq(wpBlocks.footnotes, 'name'), page.blocks)) {
    return page;
  }

  return {
    ...page,
    blocks: page.blocks.reduce(
      ({ blocks, curr }, block) => {
        if (block.name !== wpBlocks.paragraph) {
          return { blocks: [...blocks, block], curr };
        }

        const { newCurr, blockWithAnchors } = addFootnoteAnchor(curr, block);

        return { blocks: [...blocks, blockWithAnchors], curr: newCurr };
      },
      { blocks: [], curr: 1 }
    ).blocks,
  };
};
export default HandleFootnotesAnchors;
