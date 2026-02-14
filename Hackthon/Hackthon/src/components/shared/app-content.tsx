

'use client';

import React from 'react';
import { useApp } from '@/context/app-context';
import Loader from './loader';
import { useTranslation } from '@/hooks/use-translation';

export default function AppContent({ children }: { children: React.ReactNode }) {
  const { isLoading } = useApp();
  const { tStatic } = useTranslation();

  if (isLoading) {
    return <Loader text={tStatic('loader.loadingFarm')} />;
  }

  return <>{children}</>;
}
