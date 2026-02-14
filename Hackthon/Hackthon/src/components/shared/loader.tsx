

'use client';

import React from 'react';
import { useTranslation } from '@/hooks/use-translation';

export default function Loader({ text: defaultText }: { text?: string }) {
  const { tStatic } = useTranslation();
  const text = defaultText || tStatic('loader.loading');

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      {text && <p className="mt-4 text-lg font-medium text-muted-foreground">{text}</p>}
    </div>
  );
}
