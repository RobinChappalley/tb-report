import config from 'config/config';
import sanitizeSlug from 'utils/sanitizeSlug';

export const isLocalLink = link => {
  const hostUrl = new URL(config.apiHost);
  const linkUrl = new URL(link);

  return hostUrl.origin === linkUrl.origin;
};

const SanitizeUrl = link => {
  const linkUrl = new URL(link);

  if (!isLocalLink(link)) {
    return link;
  }

  return sanitizeSlug(linkUrl.pathname);
};
export default SanitizeUrl;
