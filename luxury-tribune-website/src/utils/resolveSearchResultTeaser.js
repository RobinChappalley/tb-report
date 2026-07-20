import { curry } from 'ramda';

import SearchResultSponsoredTeaser from 'components/Teaser/SearchResultSponsoredTeaser';
import SearchResultTeaser from 'components/Teaser/SearchResultTeaser';
import SearchResultTribuneTeaser from 'components/Teaser/SearchResultTribuneTeaser';
import { tribuneCategories } from 'config/config';

export default curry((language, post) => {
  // eslint-disable-next-line camelcase
  const author = post?.postAuthors?.author?.[0];

  if (post.sponsorship.sponsored) {
    return { post, author, component: SearchResultSponsoredTeaser };
  }

  if (post.categories.nodes[0].slug === tribuneCategories[language]) {
    return { post, author, component: SearchResultTribuneTeaser };
  }

  return { post, author, component: SearchResultTeaser };
});
