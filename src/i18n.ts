import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['es', 'en'];

export default getRequestConfig(async ({locale}: {locale?: string}) => {
  const currentLocale = locale || 'es';
  if (!locales.includes(currentLocale as any)) notFound();

  return {
    locale: currentLocale,
    messages: (await import(`../messages/${currentLocale}.json`)).default
  };
});
