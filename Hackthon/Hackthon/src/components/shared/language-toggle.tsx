'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/app-context';
import { cn } from '@/lib/utils';

export default function LanguageToggle() {
  const { language, setLanguage } = useApp();

  return (
    <div className="flex items-center rounded-full border p-0.5 bg-muted/60">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('en')}
        className={cn(
          'h-auto rounded-full px-2.5 py-0.5 text-xs',
          language === 'en'
            ? 'bg-background shadow'
            : 'hover:bg-muted'
        )}
      >
        En
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('ml')}
        className={cn(
          'h-auto rounded-full px-2.5 py-0.5 text-xs',
          language === 'ml'
            ? 'bg-background shadow'
            : 'hover:bg-muted'
        )}
      >
        മ
      </Button>
    </div>
  );
}

    