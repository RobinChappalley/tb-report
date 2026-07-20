import { has } from 'ramda';

import Ad from 'components/blocks/Ad';
import Buttons from 'components/blocks/Buttons';
import DigitalProduct from 'components/blocks/DigitalProduct';
import Embed from 'components/blocks/Embed';
import Footnotes from 'components/blocks/Footnotes';
import Gallery from 'components/blocks/Gallery';
import Heading from 'components/blocks/Heading';
import Image from 'components/blocks/Image';
import Insert from 'components/blocks/Insert';
import KeyNumbers from 'components/blocks/KeyNumbers';
import Lead from 'components/blocks/Lead';
import List from 'components/blocks/List';
import ListItem from 'components/blocks/ListItem';
import Newsletter from 'components/blocks/Newsletter';
import Paywall from 'components/blocks/Paywall';
import Quote from 'components/blocks/Quote';
import RelatedLink from 'components/blocks/RelatedLink';
import Separator from 'components/blocks/Separator';
import StudyLink from 'components/blocks/StudyLink';
import Text from 'components/blocks/Text';
import { wpBlocks } from 'config/config';

// Helper function to extract image URL from rendered HTML
const extractImageUrlFromHtml = html => {
  if (!html) return null;

  const imgMatch = html.match(/src="([^"]+)"/);
  return imgMatch ? imgMatch[1] : null;
};

const components = {
  [wpBlocks.buttons]: Buttons,
  [wpBlocks.digitalProduct]: DigitalProduct,
  [wpBlocks.button]: Buttons,
  [wpBlocks.embed]: Embed,
  [wpBlocks.footnotes]: Footnotes,
  [wpBlocks.gallery]: Gallery,
  [wpBlocks.heading]: Heading,
  [wpBlocks.image]: Image,
  [wpBlocks.insert]: Insert,
  [wpBlocks.keyNumbers]: KeyNumbers,
  [wpBlocks.lead]: Lead,
  [wpBlocks.studyLink]: StudyLink,
  [wpBlocks.list]: List,
  [wpBlocks.listItem]: ListItem,
  [wpBlocks.quote]: Quote,
  [wpBlocks.ad]: Ad,
  [wpBlocks.relatedLink]: RelatedLink,
  [wpBlocks.paragraph]: Text,
  [wpBlocks.paywall]: Paywall,
  [wpBlocks.newsletter]: Newsletter,
  [wpBlocks.separator]: Separator,
};

const ResolveBlockcomponents = (
  blocks,
  userHasSubscription = true,
  isSearchEngine = false,
  isPreview = false,
  ads = undefined
) => {
  // Return empty array if blocks is undefined (when blocks are disabled)
  if (!blocks) {
    return [];
  }

  let paywallIndex = blocks.length;
  let filteredBlocks = blocks;

  if (!isPreview) {
    if (userHasSubscription || isSearchEngine) {
      filteredBlocks = blocks.filter(block => block.name !== 'acf/paywall');
    } else {
      filteredBlocks.map((block, index) => {
        if (block.name === 'acf/paywall') {
          paywallIndex = index + 1;
        }

        return paywallIndex;
      });
    }

    blocks.map(block => {
      if (block.name === 'acf/ad') {
        block.attributes.adsData = ads;
      }

      return block;
    });
  }

  // Filter out duplicated button blocks (CoreButton when CoreButtons exists)
  const buttonFilteredBlocks = filteredBlocks.filter(
    (block, index, allBlocks) => {
      if (block.name === 'core/button') {
        // Check if there's a CoreButtons block nearby
        const nearbyButtons = allBlocks.slice(
          Math.max(0, index - 3),
          index + 4
        );
        const hasButtonsBlock = nearbyButtons.some(
          nearbyBlock => nearbyBlock.name === 'core/buttons'
        );
        return !hasButtonsBlock; // Keep CoreButton only if no CoreButtons nearby
      }
      return true; // Keep all other blocks
    }
  );

  // Filter out standalone images that duplicate gallery images
  const galleryFilteredBlocks = buttonFilteredBlocks.filter(
    (block, index, allBlocks) => {
      // Only check standalone core/image blocks
      if (block.name !== wpBlocks.image) {
        return true; // Keep non-image blocks
      }

      // Extract image URL from standalone image's renderedHtml
      const standaloneImageUrl = extractImageUrlFromHtml(block.renderedHtml);
      if (!standaloneImageUrl) {
        return true; // Keep if we can't extract URL
      }

      // Check if this URL exists in any nearby gallery's innerBlocks
      const searchRange = [
        ...allBlocks.slice(Math.max(0, index - 5)),
        ...allBlocks.slice(index + 1, index + 6),
      ];
      const isDuplicate = searchRange.some(nearbyBlock => {
        if (nearbyBlock.name === wpBlocks.gallery && nearbyBlock.innerBlocks) {
          return nearbyBlock.innerBlocks.some(innerBlock => {
            const innerImageUrl = extractImageUrlFromHtml(
              innerBlock.renderedHtml
            );
            return innerImageUrl === standaloneImageUrl;
          });
        }
        return false;
      });

      return !isDuplicate; // Keep if NOT a duplicate
    }
  );

  return galleryFilteredBlocks
    .filter(block => {
      const hasComponent = has(block.name, components);
      return hasComponent;
    })
    .slice(0, paywallIndex)
    .map(block => ({
      props: { ...block, resolveBlocksComponents: ResolveBlockcomponents },
      component: components[block.name],
    }));
};
export default ResolveBlockcomponents;
