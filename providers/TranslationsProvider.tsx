'use client';

import { I18nextProvider } from 'react-i18next';
import { createInstance } from 'i18next';
import { initTranslations } from '@/lib/utils';

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources
}: { children: React.ReactNode, locale: string, namespaces: string[], resources: any}) {
  const i18n = createInstance();

  initTranslations(locale, namespaces, i18n, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}