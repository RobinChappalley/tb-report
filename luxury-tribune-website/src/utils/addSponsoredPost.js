import { append, equals, pipe, remove, when } from 'ramda';

import { postsAmount } from 'config/config';

const AddSponsoredPost = (posts, sponsoredPost) =>
  pipe(
    when(
      p => equals(postsAmount.featuredCategories, p.length),
      remove(4, Infinity)
    ),
    append(sponsoredPost)
  )(posts);
export default AddSponsoredPost;
