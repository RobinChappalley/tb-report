const SanitizeSlug = slug => {
  if (!slug) return '/';

  // If it's already a full URL, extract just the pathname
  if (slug.startsWith('http://') || slug.startsWith('https://')) {
    try {
      const url = new URL(slug);
      return url.pathname;
    } catch (e) {
      return '/';
    }
  }

  // Otherwise, treat as relative path
  return slug.replace(/^\/?(.+?)\/*$/, '/$1');
};
export default SanitizeSlug;
