import { format, parse, parseISO } from 'date-fns';
import { enGB, fr } from 'date-fns/locale';
import { isNil } from 'ramda';

import i18next from 'locales/i18n';

// eslint-disable-next-line consistent-return
const i18nDate = frmt => (date, isIso) => {
  const loc = i18next.language === 'en' ? enGB : fr;
  if (isNil(date) || date === '') return '';

  try {
    let formattedDate;

    // Try to parse as ISO date first (handles timezone)
    if (date.includes('T') || date.includes('Z') || date.includes('+')) {
      if (frmt === 'HH') {
        return date.substring(11, 13);
      }
      if (frmt === 'mm') {
        return date.substring(14, 16);
      }
      formattedDate = parseISO(date);
    } else {
      // Fallback to custom format
      formattedDate = isIso
        ? parseISO(date, 'yyyy-MM-dd kk:mm:ss', new Date())
        : parse(date, 'yyyy-MM-dd kk:mm:ss', new Date());
    }

    if (
      formattedDate instanceof Date &&
      !Number.isNaN(formattedDate.getTime())
    ) {
      return format(formattedDate, frmt, { locale: loc });
    }
  } catch (error) {
    console.warn('Invalid date format:', date, error);
  }

  return '';
};

export default i18nDate;
