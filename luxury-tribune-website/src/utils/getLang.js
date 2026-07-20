import { defaultLng, lngs } from 'locales/languages';

const Lang = path => {
  const noDefaultLngs = lngs.slice(1).join('|');
  const matchLng = new RegExp(`^/(${noDefaultLngs})(?:/|\\?|$)`, 'g').exec(
    path
  );
  return matchLng ? matchLng[1] : defaultLng;
};
export default Lang;
