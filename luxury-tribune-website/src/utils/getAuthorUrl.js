import { defaultLng } from 'locales/languages';

const GetAuthor = lng =>
  lng === defaultLng ? '/authors/[...slug]' : '/en/authors/[...slug]';
export default GetAuthor;
