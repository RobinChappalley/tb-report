import { lookup } from 'accept-language-negotiator';

import { lngs } from 'locales/languages';

const DetectVisitorLanguage = acceptLanguageHeader =>
  lookup(acceptLanguageHeader, lngs, null);
export default DetectVisitorLanguage;
