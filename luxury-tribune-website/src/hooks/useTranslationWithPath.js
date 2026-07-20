import { useTranslation } from 'react-i18next';

export default path => {
  const [translate, i18n] = useTranslation();

  return [(key, options = {}) => translate(`${path}.${key}`, options), i18n];
};
