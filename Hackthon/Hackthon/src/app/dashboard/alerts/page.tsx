
'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CloudSun, Bug, Landmark, CloudRain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { generateWeatherAlerts, WeatherAlert } from '@/ai/flows/generate-weather-alerts';
import { Skeleton } from '@/components/ui/skeleton';
import { useApp } from '@/context/app-context';

const initialAlerts = {
  pest: [
    {
      id: 'p1',
      title: 'Pest Alert: Rice Gall Midge',
      description: 'Conditions are favorable for Rice Gall Midge infestation in your area. Monitor your paddy fields closely.',
      date: '2024-07-26',
      severity: 'High',
    },
     {
      id: 'p2',
      title: 'Fungal Alert: Blast Disease',
      description: 'High humidity increases the risk of Blast Disease in paddy. Look for symptoms on leaves.',
      date: '2024-07-24',
      severity: 'Medium',
    },
  ],
  schemes: [
    {
      id: 's1',
      title: 'Rice Development Scheme (2025–26)',
      description: 'The Kerala government has allocated ₹13,420 lakh to enhance paddy cultivation through various initiatives.',
      date: '2024-07-28',
      severity: 'Info',
    },
    {
      id: 's2',
      title: 'Soil Health Management (SHM) Scheme',
      description: 'Provides assistance up to ₹500 per hectare (or 50% of cost) for micro and secondary nutrients for non-paddy crops, based on soil test results.',
      date: '2024-07-27',
      severity: 'Info',
    },
    {
      id: 's3',
      title: 'Pokkali Rice and Coastal Wetland Initiatives',
      description: 'MGNREGA funds and labor are being allocated for the revival of fallow Pokkali farmlands to preserve this traditional organic farming heritage.',
      date: '2024-07-26',
      severity: 'Info',
    },
    {
      id: 's4',
      title: 'Kole Development Project',
      description: 'A ₹425 crore project for the comprehensive development of Thrissur Kole fields, including infrastructure, bunds, canals, roads, and farm mechanization.',
      date: '2024-07-25',
      severity: 'Info',
    },
    {
      id: 's5',
      title: 'National Horticulture Mission (NHM)',
      description: 'A centrally sponsored scheme to promote holistic growth of the horticulture sector, including fruits, vegetables, flowers, and spices.',
      date: '2024-07-24',
      severity: 'Info',
    },
    {
      id: 's6',
      title: 'Wetland Conservation Awareness',
      description: 'State Wetland Authority Kerala (SWAK) has released funds for proposals on wetland conservation awareness to involve local communities.',
      date: '2024-07-23',
      severity: 'Info',
    }
  ],
};

const getSeverityBadge = (severity: string) => {
    switch(severity.toLowerCase()){
        case 'high': return <Badge variant="destructive">High</Badge>;
        case 'medium': return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
        case 'info': return <Badge variant="secondary">Info</Badge>;
        default: return <Badge>{severity}</Badge>
    }
}

const AlertCard = ({ alert }: { alert: { id: string; title: string; description: string; date: string; severity: string } }) => (
    <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
            <div className="flex justify-between items-start">
                <CardTitle>{alert.title}</CardTitle>
                {getSeverityBadge(alert.severity)}
            </div>
            <CardDescription>{new Date(alert.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">{alert.description}</p>
        </CardContent>
    </Card>
);

export default function AlertsPage() {
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useApp();
  
  useEffect(() => {
    async function fetchWeatherAlerts() {
      if (!profile) return;
      setIsLoading(true);
      try {
        const farmerActivityContext = {
            recentActivities: [
                { activity: "sowing", crop: "Paddy", date: "3 days ago" },
                { activity: "pesticide spraying", crop: "Paddy", date: "1 day ago" }
            ],
            currentWeather: "Partly cloudy, 29°C, Humidity 80%, Wind 15 km/h",
            location: `${profile.village}, Kerala`
        };
        const response = await generateWeatherAlerts(farmerActivityContext);
        // Add id and date to the alerts for consistency with other alert types
        const alertsWithIds = response.alerts.map((alert, index) => ({
            ...alert,
            id: `w-${index + 1}`,
            date: new Date().toISOString().split('T')[0]
        }))
        setWeatherAlerts(alertsWithIds);
      } catch (error) {
        console.error("Failed to fetch weather alerts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWeatherAlerts();
  }, [profile]);

  const allAlerts = [...weatherAlerts, ...initialAlerts.pest, ...initialAlerts.schemes].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-8">
      <PageHeader
        title="Advisories & Alerts"
        description="Stay updated with personalized alerts for your farm."
        icon={<Bell className="w-6 h-6 text-primary" />}
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="weather">
            <CloudSun className="mr-2 h-4 w-4" /> Weather
          </TabsTrigger>
          <TabsTrigger value="pest">
            <Bug className="mr-2 h-4 w-4" /> Pest
          </TabsTrigger>
          <TabsTrigger value="schemes">
            <Landmark className="mr-2 h-4 w-4" /> Schemes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading && Array.from({length:2}).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
                {allAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
            </div>
        </TabsContent>
        <TabsContent value="weather" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading && Array.from({length:2}).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
                {!isLoading && weatherAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
                {!isLoading && weatherAlerts.length === 0 && <p className="text-muted-foreground col-span-full text-center">No new weather alerts.</p>}
            </div>
        </TabsContent>
        <TabsContent value="pest" className="mt-6">
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {initialAlerts.pest.map(alert => <AlertCard key={alert.id} alert={alert} />)}
            </div>
        </TabsContent>
        <TabsContent value="schemes" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {initialAlerts.schemes.map(alert => <AlertCard key={alert.id} alert={alert} />)}
            </div>
            {initialAlerts.schemes.length === 0 && <p className="text-muted-foreground col-span-full text-center">No new scheme alerts.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}

    

    