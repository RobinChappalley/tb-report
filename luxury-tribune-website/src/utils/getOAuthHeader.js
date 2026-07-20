import crypto from 'crypto';

import OAuth from 'oauth-1.0a';

import config from '../config/config';

const getOAuthHeader = request => {
  // oAuthentification for REST API
  const oauth = OAuth({
    consumer: {
      key: config.publicConsumerKey,
      secret: config.secretConsumerKey,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(baseString, key) {
      return crypto.createHmac('sha1', key).update(baseString).digest('base64');
    },
  });

  return oauth.toHeader(oauth.authorize(request, {}));
};
export default getOAuthHeader;
