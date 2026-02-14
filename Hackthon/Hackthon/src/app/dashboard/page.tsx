
'use client';

import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Book,
  Bot,
  Bell,
  Sun,
  Cloud,
  ArrowRight,
  Activity,
  Wind,
  Droplets,
  CloudRain,
  Camera,
  Newspaper,
  Landmark,
  AlarmClock,
  AlertTriangle,
  Mic,
  TrendingUp,
} from 'lucide-react';
import PageHeader from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import React, { useState } from 'react';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/context/app-context';
import { useTranslation } from '@/hooks/use-translation';

// Data from crop prices page to be used in the ticker
const marketCrops = [
  { name: 'Rubber', price: 180, trend: 'up' },
  { name: 'Pepper', price: 550, trend: 'up' },
  { name: 'Coconut', price: 30, trend: 'stable' },
  { name: 'Banana', price: 45, trend: 'down' },
  { name: 'Rice (Uma)', price: 42, trend: 'stable' },
  { name: 'Tapioca', price: 35, trend: 'up' },
];

export default function DashboardPage() {
  const { toast } = useToast();
  const { profile, language } = useApp();
  const [readingAloud, setReadingAloud] = useState<string | null>(null);
  const { tStatic } = useTranslation();

  const farmerName = profile?.name?.split(' ')[0] || tStatic('dashboard.page.defaultFarmer');

  const tPlural = (key: string, count: number) => {
    const keyWithSuffix = count === 1 ? key : `${key}s`;
    return tStatic(keyWithSuffix, { count });
  };

  const quickActions = [
    {
      title: tStatic('dashboard.quickActions.logActivity.title'),
      description: tStatic('dashboard.quickActions.logActivity.description'),
      href: '/dashboard/activity',
      icon: Book,
    },
    {
      title: tStatic('dashboard.quickActions.getAiAdvice.title'),
      description: tStatic('dashboard.quickActions.getAiAdvice.description'),
      href: '/dashboard/advice',
      icon: Bot,
    },
    {
      title: tStatic('dashboard.quickActions.viewAlerts.title'),
      description: tStatic('dashboard.quickActions.viewAlerts.description'),
      href: '/dashboard/alerts',
      icon: Bell,
    },
     {
      title: tStatic('dashboard.quickActions.pestCheck.title'),
      description: tStatic('dashboard.quickActions.pestCheck.description'),
      href: '/dashboard/pest-check',
      icon: Camera,
    },
  ];

  const recentActivities = [
    { type: tStatic('dashboard.recentActivities.sowing'), crop: tStatic('dashboard.page.paddy'), date: tPlural('dashboard.page.dayAgo', 2) },
    { type: tStatic('dashboard.recentActivities.irrigation'), duration: tPlural('dashboard.page.hour', 2), date: tPlural('dashboard.page.dayAgo', 1) },
    { type: tStatic('dashboard.recentActivities.fertilizer'), crop: tStatic('dashboard.page.paddy'), typeName: 'Urea', date: tPlural('dashboard.page.hourAgo', 5)},
  ];

  const weatherForecast = [
      { time: tStatic('dashboard.weather.now'), temp: '28°', icon: Sun },
      { time: '3 PM', temp: '29°', icon: Cloud },
      { time: '6 PM', temp: '26°', icon: Sun },
      { time: '9 PM', temp: '24°', icon: CloudRain },
  ]

  const advisoryCards = [
      {
          title: tStatic('dashboard.advisories.rain.title'),
          action: tStatic('dashboard.advisories.rain.action'),
          icon: CloudRain,
          color: "blue",
          href: "/dashboard/alerts"
      },
      {
          title: tStatic('dashboard.advisories.pest.title'),
          action: tStatic('dashboard.advisories.pest.action'),
          icon: AlertTriangle,
          color: "yellow",
          href: "/dashboard/alerts"
      },
      {
          title: tStatic('dashboard.advisories.scheme.title'),
          action: tStatic('dashboard.advisories.scheme.action'),
          icon: Landmark,
          color: "green",
          href: "/dashboard/alerts"
      }
  ];

  const scrollingReminders = [
    tStatic('dashboard.reminders.pesticide'),
    tStatic('dashboard.reminders.scheme'),
    tStatic('dashboard.reminders.pumps'),
  ];
  
  const highValueCrops = marketCrops
    .filter(crop => crop.trend === 'up' || crop.price > 100)
    .map(crop => ` ${crop.name}: ₹${crop.price}/kg`);

  const priceTickerContent = `Good time to sell:${highValueCrops.join('  | ')}`;


  const recentNews = [
      {
          id: 'n1',
          title: tStatic('dashboard.news.msp.title'),
          source: tStatic('dashboard.news.msp.source'),
          date: tPlural('dashboard.page.dayAgo', 3),
          icon: Newspaper,
      },
      {
          id: 's1',
          title: tStatic('dashboard.news.pmkisan.title'),
          source: tStatic('dashboard.news.pmkisan.source'),
          date: tPlural('dashboard.page.weekAgo', 1),
          icon: Landmark,
      },
      {
          id: 'n2',
          title: tStatic('dashboard.news.cardamom.title'),
          source: tStatic('dashboard.news.cardamom.source'),
          date: tPlural('dashboard.page.weekAgo', 2),
          icon: Newspaper,
      }
  ]


  const handleReadAloud = async (text: string) => {
    if (readingAloud === text) {
      // Simple toggle to stop, a more robust solution would manage audio playback state
      setReadingAloud(null);
      return;
    }
    setReadingAloud(text);
    try {
      const result = await textToSpeech({ text, languageCode: language === 'en' ? 'en-US' : 'ml-IN' });
      const audio = new Audio(result.audioDataUri);
      audio.play();
      audio.onended = () => setReadingAloud(null);
    } catch (error) {
      console.error('TTS Error:', error);
      toast({
        variant: 'destructive',
        title: tStatic('dashboard.page.ttsError.title'),
        description: tStatic('dashboard.page.ttsError.description'),
      });
      setReadingAloud(null);
    }
  };
  
  const ScrollingReminders = () => (
    <Card className="p-2 bg-blue-50 border-blue-200 w-full max-w-sm">
      <div className="flex items-center gap-2">
        <AlarmClock className="h-4 w-4 text-blue-600 flex-shrink-0" />
        <div className="flex-1 overflow-hidden">
          <p className="text-xs font-semibold text-blue-800">{tStatic('dashboard.reminders.next')}</p>
          <div className="relative h-4 flex items-center">
             <div className="animate-marquee-slow-infinite whitespace-nowrap">
                <span className="text-xs text-blue-600">
                    {scrollingReminders.join("   |   ")}
                </span>
                <span className="text-xs text-blue-600 ml-8">
                    {scrollingReminders.join("   |   ")}
                </span>
              </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const PriceTicker = () => (
    <Card className="p-2 bg-green-50 border-green-200 w-full max-w-sm">
        <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600 flex-shrink-0"/>
            <div className="flex-1 overflow-hidden">
                 <p className="text-xs font-semibold text-green-800">Market Prices</p>
                 <div className="relative h-4 flex items-center">
                    <div className="animate-marquee-infinite whitespace-nowrap">
                        <span className="text-xs text-green-600 font-medium">
                            {priceTickerContent}
                        </span>
                        <span className="text-xs text-green-600 font-medium ml-8">
                           {priceTickerContent}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </Card>
  );


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-shrink-0">
          <h1 className="font-headline text-3xl font-bold">{tStatic('dashboard.page.welcome', { name: farmerName })}</h1>
          <p className="text-muted-foreground">{tStatic('dashboard.page.welcomeSubtitle')}</p>
        </div>
        
        <div className="hidden md:flex flex-1 flex-col xl:flex-row gap-4 items-center justify-center">
            <div className="w-full max-w-[320px]"><PriceTicker /></div>
            <div className="w-full max-w-[320px]"><ScrollingReminders /></div>
        </div>

        <div className="w-full md:w-auto flex justify-end">
          <Link href="/dashboard/alerts" className="w-full sm:w-auto">
            <Badge variant="destructive" className="h-10 px-4 text-sm flex items-center justify-center gap-2 w-full sm:w-auto">
              <Bell className="h-5 w-5" /> {tStatic('dashboard.page.pestAlerts', { count: 2 })}
            </Badge>
          </Link>
        </div>
      </div>
      
       <div className="flex md:hidden flex-col gap-4">
            <PriceTicker />
            <ScrollingReminders />
       </div>
      
       <Card>
        <CardHeader className="flex flex-row items-start justify-between">
            <div>
                <CardTitle>{tStatic('dashboard.weather.title')}</CardTitle>
                <CardDescription>{tStatic('dashboard.weather.location', { village: profile?.village || tStatic('dashboard.weather.defaultLocation') })}</CardDescription>
            </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex gap-4 items-center">
              <Sun className="w-16 h-16 text-yellow-500" />
              <div>
                <div className="text-5xl font-bold">28°C</div>
                <div className="text-lg text-muted-foreground">{tStatic('dashboard.weather.sunny')}</div>
              </div>
            </div>
             <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-muted-foreground" />
                <span>{tStatic('dashboard.weather.wind')}: 12 km/h</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-muted-foreground" />
                <span>{tStatic('dashboard.weather.humidity')}: 75%</span>
              </div>
               <div className="flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-muted-foreground" />
                <span>{tStatic('dashboard.weather.precipitation')}: 10%</span>
              </div>
               <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-muted-foreground" />
                <span>{tStatic('dashboard.weather.uv')}: {tStatic('dashboard.weather.uvHigh')}</span>
              </div>
            </div>
          </div>
           <div className="mt-8">
            <h3 className="font-semibold mb-4">{tStatic('dashboard.weather.hourlyForecast')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {weatherForecast.map(forecast => (
                <Card key={forecast.time} className="p-2 flex flex-col items-center justify-center bg-muted/50">
                  <p className="text-xs font-medium">{forecast.time}</p>
                  <forecast.icon className="w-6 h-6 my-1 text-yellow-500" />
                  <p className="font-bold text-sm">{forecast.temp}</p>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-headline text-xl font-bold mb-4">{tStatic('dashboard.quickActions.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link href={action.href} key={action.title} className="block">
              <Card className="hover:shadow-lg transition-shadow duration-300 group h-full">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2 justify-center h-full">
                  <div className="bg-primary/10 text-primary p-3 rounded-full transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">{action.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="font-headline text-xl font-bold mb-4">{tStatic('dashboard.advisories.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {advisoryCards.map((card, index) => {
            const advisoryText = `${card.title}. ${card.action}.`;
            return (
              <Card
                key={index}
                className="bg-background shadow-green-300/40 shadow-md"
              >
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 text-green-600 p-3 rounded-full">
                      <card.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-green-700">
                        {card.title}
                      </CardTitle>
                      <p className="text-sm font-medium text-green-600 flex items-center">
                        {card.action}
                        <Link href={card.href} className="ml-1">
                           <ArrowRight className="h-4 w-4" />
                        </Link>
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-2">
                     <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleReadAloud(advisoryText)}
                      disabled={readingAloud !== null}
                      className="text-green-600 cursor-pointer"
                    >
                      <Mic className={`h-5 w-5 ${readingAloud === advisoryText ? 'animate-pulse' : ''}`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>


      <div className="space-y-6">
        <PageHeader title={tStatic('dashboard.recentActivities.title')} />
        <Card>
            <CardContent className="p-4">
                <ul className="space-y-4">
                    {recentActivities.map((activity, index) => (
                        <li key={index} className="flex items-center gap-4">
                            <div className="bg-gray-100 p-2 rounded-full">
                                <Activity className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">{activity.type}</p>
                                <p className="text-sm text-muted-foreground">{activity.crop || activity.duration}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </li>
                    ))}
                </ul>
                <Button variant="link" asChild className="w-full mt-4">
                  <Link href="/dashboard/activity">{tStatic('dashboard.page.viewAll')} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </CardContent>
        </Card>
      </div>
      
       <div className="space-y-6">
        <PageHeader title={tStatic('dashboard.news.title')} />
        <Card>
            <CardContent className="p-4">
                <ul className="space-y-4">
                    {recentNews.map((news) => (
                        <li key={news.id} className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50">
                            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                <news.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">{news.title}</p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                  <span>{news.source}</span>
                                  <span>{news.date}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <Button variant="link" asChild className="w-full mt-4">
                  <Link href="/dashboard/alerts">{tStatic('dashboard.news.viewMore')} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}

    

    