
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Leaf,
  Bot,
  Camera,
  Book,
  ArrowRight,
  Sun,
  CloudRain,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import LanguageToggle from '@/components/shared/language-toggle';
import { useTranslation } from '@/hooks/use-translation';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function HomePage() {
    const { tStatic } = useTranslation();

    const features = [
      {
        icon: Camera,
        key: 'pestDetection',
        title: tStatic('home.features.pestDetection.title'),
        description: tStatic('home.features.pestDetection.description'),
      },
      {
        icon: Bot,
        key: 'cropAdvice',
        title: tStatic('home.features.cropAdvice.title'),
        description: tStatic('home.features.cropAdvice.description'),
      },
      {
        icon: Sun,
        key: 'weather',
        title: tStatic('home.features.weather.title'),
        description: tStatic('home.features.weather.description'),
      },
      {
        icon: Book,
        key: 'logging',
        title: tStatic('home.features.logging.title'),
        description: tStatic('home.features.logging.description'),
      },
    ];

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
        },
      },
    };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold font-headline">
              {tStatic('home.title')}
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageToggle />
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/login">{tStatic('home.login')}</Link>
            </Button>
            <Button asChild className="bg-accent hover:bg-accent/90">
              <Link href="/login">{tStatic('home.getStarted')}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 py-16 text-center md:grid-cols-2 md:py-24 md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              {tStatic('home.hero.title')}
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground md:mx-0">
              {tStatic('home.hero.subtitle')}
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90">
                <Link href="/login">
                  {tStatic('home.hero.cta')} <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <Image
              src="https://picsum.photos/seed/kerala-farm/600/400"
              alt="Lush green paddy fields in Kerala"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl"
              data-ai-hint="kerala farm"
            />
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg w-56"
             >
                <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={20}/>
                    <h4 className="font-bold">{tStatic('home.pestCheck.title')}</h4>
                </div>
                <p className="text-xs">{tStatic('home.pestCheck.line1')}</p>
                <p className="text-xs">{tStatic('home.pestCheck.line2')}</p>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted/50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold">
                {tStatic('home.features.title')}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {tStatic('home.features.subtitle')}
              </p>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
            >
              {features.map((feature) => (
                <motion.div key={feature.key} variants={itemVariants}>
                  <Card className="text-center h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <feature.icon className="h-6 w-6" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                 <div className="mx-auto max-w-3xl text-center">
                    <h2 className="font-headline text-3xl font-bold">{tStatic('home.howItWorks.title')}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {tStatic('home.howItWorks.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-center relative">
                    {/* Dashed line for desktop */}
                     <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2">
                        <svg width="100%" height="2" className="overflow-visible">
                            <line x1="0" y1="1" x2="100%" y2="1" strokeWidth="2" stroke="hsl(var(--border))" strokeDasharray="8 8"/>
                        </svg>
                    </div>

                    <div className="relative flex flex-col items-center p-6 bg-background">
                         <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground border-4 border-background font-bold text-2xl mb-4">1</div>
                        <h3 className="font-bold text-lg mb-2">{tStatic('home.howItWorks.step1.title')}</h3>
                        <p className="text-muted-foreground text-sm">{tStatic('home.howItWorks.step1.description')}</p>
                    </div>
                     <div className="relative flex flex-col items-center p-6 bg-background">
                         <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground border-4 border-background font-bold text-2xl mb-4">2</div>
                        <h3 className="font-bold text-lg mb-2">{tStatic('home.howItWorks.step2.title')}</h3>
                        <p className="text-muted-foreground text-sm">{tStatic('home.howItWorks.step2.description')}</p>
                    </div>
                     <div className="relative flex flex-col items-center p-6 bg-background">
                         <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground border-4 border-background font-bold text-2xl mb-4">3</div>
                        <h3 className="font-bold text-lg mb-2">{tStatic('home.howItWorks.step3.title')}</h3>
                        <p className="text-muted-foreground text-sm">{tStatic('home.howItWorks.step3.description')}</p>
                    </div>
                </div>
            </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-semibold">{tStatic('home.title')}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {tStatic('home.footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              {tStatic('home.footer.privacy')}
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              {tStatic('home.footer.terms')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
