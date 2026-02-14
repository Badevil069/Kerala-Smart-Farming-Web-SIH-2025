
'use client';

import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LineChart,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  Lightbulb,
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Badge } from '@/components/ui/badge';

type MarketCrop = {
  name: string;
  price: number;
  updated: string;
  trend: 'up' | 'down' | 'stable';
};

const initialMarketCrops: MarketCrop[] = [
  { name: 'Rubber', price: 180, updated: 'Today', trend: 'up' },
  { name: 'Pepper', price: 550, updated: 'Today', trend: 'up' },
  { name: 'Coconut', price: 30, updated: 'Yesterday', trend: 'stable' },
  { name: 'Banana', price: 45, updated: 'Today', trend: 'down' },
  { name: 'Rice (Uma)', price: 42, updated: 'Yesterday', trend: 'stable' },
  { name: 'Tapioca', price: 35, updated: 'Today', trend: 'up' },
  { name: 'Cashew', price: 700, updated: 'Yesterday', trend: 'down' },
  { name: 'Ginger', price: 120, updated: 'Today', trend: 'up' },
];

const bestSellingTip = 'Pepper prices are currently high due to increased demand. Consider selling your stock now for better returns.';
const tips = [
    'Grade your produce properly to fetch higher prices.',
    'Connect with local farmer producer organizations (FPOs) for bulk selling.',
    'Check market prices daily before selling your produce.',
];


export default function CropPricesPage() {
  const { tStatic } = useTranslation();
  const [sortConfig, setSortConfig] = useState<{ key: keyof MarketCrop, direction: 'ascending' | 'descending' } | null>(null);

  const sortedCrops = useMemo(() => {
    let sortableItems = [...initialMarketCrops];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [sortConfig]);
  
  const requestSort = (key: keyof MarketCrop) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: keyof MarketCrop) => {
      if (!sortConfig || sortConfig.key !== key) {
          return <ChevronsUpDown className="h-4 w-4 text-muted-foreground/70" />;
      }
      return sortConfig.direction === 'ascending' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };
  
  const highestPriceCrop = useMemo(() => sortedCrops.reduce((max, crop) => max.price > crop.price ? max : crop), [sortedCrops]);


  return (
    <div className="space-y-8">
      <PageHeader
        title="Kerala Crop Prices"
        description="Stay updated with the latest market rates of major crops"
        icon={<LineChart className="h-6 w-6 text-primary" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Major Crop Market Prices</CardTitle>
              <CardDescription>
                Prices from major markets in Kerala.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                       <Button variant="ghost" onClick={() => requestSort('name')} className="px-1">
                          Crop Name {getSortIcon('name')}
                       </Button>
                    </TableHead>
                    <TableHead>
                       <Button variant="ghost" onClick={() => requestSort('price')} className="px-1">
                          Avg. Price (₹/kg) {getSortIcon('price')}
                       </Button>
                    </TableHead>
                     <TableHead className="text-center">Trend</TableHead>
                    <TableHead className="text-right">Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCrops.map(crop => (
                    <TableRow key={crop.name}>
                      <TableCell className="font-medium">{crop.name}</TableCell>
                      <TableCell className="font-semibold">₹{crop.price.toFixed(2)}</TableCell>
                       <TableCell className="text-center">
                        {crop.trend === 'up' && <TrendingUp className="h-5 w-5 text-green-500 mx-auto" />}
                        {crop.trend === 'down' && <TrendingDown className="h-5 w-5 text-red-500 mx-auto" />}
                        {crop.trend === 'stable' && <span className="text-muted-foreground">=</span>}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{crop.updated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
            <Card className="bg-green-50 border-green-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                        <CircleDollarSign /> Best Time to Sell
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-bold text-lg">{highestPriceCrop.name} at ₹{highestPriceCrop.price.toFixed(2)}/kg</p>
                    <p className="text-sm text-green-700 mt-1">{bestSellingTip}</p>
                </CardContent>
            </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Trends</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {initialMarketCrops.filter(c => c.trend !== 'stable').slice(0, 4).map(crop => (
                <div key={crop.name} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{crop.name}</span>
                     <Badge variant={crop.trend === 'up' ? 'default' : 'destructive'} className="bg-green-100 text-green-800 data-[destructive]:bg-red-100 data-[destructive]:text-red-800">
                        {crop.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1"/> : <TrendingDown className="h-3 w-3 mr-1"/>}
                        Trending {crop.trend}
                    </Badge>
                </div>
               ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb /> Tips for Better Returns</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground list-disc pl-5">
                    {tips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>Nearby Market Info</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon – Get real-time prices from local mandis.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
