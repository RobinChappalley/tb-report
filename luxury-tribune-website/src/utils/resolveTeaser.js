import { curry } from 'ramda';

import KeyNumberTeaser from 'components/Teaser/KeyNumberTeaser';
import SponsoredTeaser from 'components/Teaser/SponsoredTeaser';
import Teaser from 'components/Teaser/Teaser';
import TribuneTeaser from 'components/Teaser/TribuneTeaser';
import { tribuneCategories } from 'config/config';

export default curry((language, post) => {
  // eslint-disable-next-line camelcase
  const author = post?.postAuthors?.author?.edges?.[0]?.node;

  if (post.sponsorship.sponsored) {
    return { post, author, component: SponsoredTeaser };
  }

  if (post.teaserOptions.style === 'number') {
    return { post, component: KeyNumberTeaser };
  }

  if (post.categories.nodes[0].slug === tribuneCategories[language]) {
    return { post, author, component: TribuneTeaser };
  }

  return { post, author, component: Teaser };
});
