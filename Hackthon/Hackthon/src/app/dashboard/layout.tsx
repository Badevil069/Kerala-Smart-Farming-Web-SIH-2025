

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Book,
  Bot,
  Bell,
  Camera,
  Leaf,
  LineChart,
} from 'lucide-react';
import UserNav from '@/components/dashboard/user-nav';
import LanguageToggle from '@/components/shared/language-toggle';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { tStatic } = useTranslation();

  const navItems = [
    { href: '/dashboard', label: tStatic('dashboard.nav.dashboard'), icon: Home },
    { href: '/dashboard/pest-check', label: tStatic('dashboard.nav.pestCheck'), icon: Camera },
    { href: '/dashboard/advice', label: tStatic('dashboard.nav.advisor'), icon: Bot },
    { href: '/dashboard/activity', label: tStatic('dashboard.nav.activity'), icon: Book },
    { href: '/dashboard/crop-prices', label: tStatic('dashboard.nav.cropPrices'), icon: LineChart },
    { href: '/dashboard/alerts', label: tStatic('dashboard.nav.alerts'), icon: Bell },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Leaf className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <span className="text-md md:text-lg font-headline font-bold">{tStatic('home.title')}</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
               <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-all hover:text-primary',
                  pathname === item.href && 'text-primary bg-primary/10 font-semibold'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <LanguageToggle />
          <UserNav />
        </div>
      </header>
      
      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden h-16 bg-background/80 backdrop-blur-sm border-t">
        <div className="grid h-full max-w-lg grid-cols-6 mx-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex flex-col items-center justify-center px-2 group transition-colors',
                pathname === item.href ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted/50'
              )}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium text-center">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      <footer className="hidden md:block border-t py-6 px-4 md:px-6 bg-background">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-2">
             <Leaf className="h-5 w-5 text-muted-foreground" />
             <p className="text-sm text-muted-foreground font-semibold">{tStatic('home.title')}</p>
           </div>
           <p className="text-xs text-muted-foreground">
              {tStatic('home.footer.copyright', { year: new Date().getFullYear() })}
            </p>
           <div className="flex gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">{tStatic('home.footer.privacy')}</Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">{tStatic('home.footer.terms')}</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
