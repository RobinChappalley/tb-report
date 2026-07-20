import { defaultLng } from 'locales/languages';

const GetEventUrl = (lng, slug) =>
  lng === defaultLng ? `/events/${slug}` : `/en/events/${slug}`;
export default GetEventUrl;
