
'use client';

import { useApp } from '@/context/app-context';
import en from '@/lib/locales/en.json';
import ml from '@/lib/locales/ml.json';
import { useMemo } from 'react';

const translations: Record<string, any> = {
  en: en,
  ml: ml,
};


export const useTranslation = () => {
  const { language } = useApp();

  const tStatic = useMemo(() => (key: string, options?: {[key: string]: string | number}): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing in the current language
        let fallbackResult: any = translations['en'];
        let foundFallback = true;
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
            if (fallbackResult === undefined) {
                foundFallback = false;
                break;
            }
        }

        if(foundFallback) {
          result = fallbackResult;
        } else {
          return key; // Return the key if not found in any language
        }
        break; // Exit the loop once we've switched to fallback
      }
    }

    let resultString = result || key;

    if (options && typeof resultString === 'string') {
      Object.keys(options).forEach(optKey => {
        resultString = resultString.replace(`{${optKey}}`, String(options[optKey]));
      });
    }
    
    return resultString;

  }, [language]);

  return { tStatic, language };
};
