

'use client';

import React, { useState } from 'react';
import {
  Bot,
  Sprout,
  Droplets,
  TestTube2,
  Bug,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  MoreHorizontal,
  BrainCircuit,
  Leaf,
  Sun,
  CloudRain,
  Globe,
  Map,
  Nut,
  Wind,
  Flower,
  Coffee,
  ListChecks,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import PageHeader from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/context/app-context';

const PaddyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
        <path d="M2 22v-2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2"/>
        <path d="M12 2v16"/>
        <path d="M8 8.5c-2 2.5-2 6.5 0 9"/>
        <path d="M16 8.5c2 2.5 2 6.5 0 9"/>
        <path d="m14 14-2-2-2 2"/>
    </svg>
);

const PulsesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13.33 7.67a3 3 0 1 1-5.66 2.66 3 3 0 0 1 5.66-2.66z"/>
        <path d="M14.24 10.24a3 3 0 1 1-5.48 3.52 3 3 0 0 1 5.48-3.52z"/>
        <path d="M13.91 14.83a3 3 0 1 1-5.82 1.34 3 3 0 0 1 5.82-1.34z"/>
        <path d="M4 15.5A8.5 8.5 0 0 0 15.5 4"/>
    </svg>
);

const VegetablesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 11 6a7 7 0 0 1 7 7c0 2.22-1.01 4.14-2.6 5.4A3.5 3.5 0 0 1 12.5 18a3.5 3.5 0 0 1-1.4-.33"/>
        <path d="M15.5 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"/>
        <path d="M22 9c-4.42 0-8 3.58-8 8"/>
    </svg>
);

const PokkaliIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a2 2 0 0 0 2-2V8l-2.7-2.7a2.7 2.7 0 0 0-3.82 0L5 8v12a2 2 0 0 0 2 2h5z"/>
        <path d="M12 22a8 8 0 0 0 8-8V8"/>
        <path d="m11.12 6.54.59-.59a2 2 0 0 1 2.83 0l.59.59"/>
        <path d="M15.7 13.3a2.5 2.5 0 0 1-3.4 0l-4.6-4.6a2.5 2.5 0 0 1 0-3.4l.6-.6a2.5 2.5 0 0 1 3.4 0l4.6 4.6a2.5 2.5 0 0 1 0 3.4Z"/>
    </svg>
);

const RubberIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a4 4 0 0 0 4-4V2"/>
        <path d="M12 2h4"/>
        <path d="M12 11h7a4 4 0 0 1 4 4v2a2 2 0 0 1-2 2h-1"/>
        <path d="M12 22a4 4 0 0 1-4-4V2"/>
        <path d="M4 14a2 2 0 0 1 2-2h2"/>
    </svg>
);
const BananaIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12c0-6.627 5.373-12 12-12 1.39 0 2.71.24 3.95.68"/>
        <path d="M4 12C4 6 12 2 12 2"/>
        <path d="M8 12c0-6 8-10 8-10"/>
        <path d="M12.5 21.5c0-6.075-3.582-11-8-11"/>
    </svg>
);

const TapiocaIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 20V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12"/>
        <path d="M14.5 12a2.5 2.5 0 0 0-5 0V8"/>
        <path d="M8 14h1"/>
        <path d="M15 14h1"/>
        <path d="M12 8v-2a2 2 0 0 0-2-2H8"/>
    </svg>
);

const crops = [
  { value: 'paddy', label: 'Paddy', icon: PaddyIcon },
  { value: 'pulses', label: 'Pulses', icon: PulsesIcon },
  { value: 'vegetables', label: 'Vegetables', icon: VegetablesIcon },
  { value: 'pokkali', label: 'Pokkali + Prawn', icon: PokkaliIcon },
];

const mockData: any = {
  paddy: {
    seasonalSuitability: {
      isSuitable: true,
      text: "This is a good season for paddy cultivation (Kharif/Virippu).",
    },
    weatherSuitability: {
      isSuitable: true,
      text: "Current weather with moderate rain is ideal for transplanting.",
    },
    soilSuitability: {
        text: 'Prefers heavy soils like clayey loam or clay in wetland areas.',
    },
    roadmap: [
        { stage: 1, title: "Land Preparation", duration: "1-2 weeks" },
        { stage: 2, title: "Sowing & Transplanting", duration: "2-3 weeks" },
        { stage: 3, title: "Vegetative Growth", duration: "8-10 weeks" },
        { stage: 4, title: "Flowering & Grain Filling", duration: "4-5 weeks" },
        { stage: 5, title: "Harvesting", duration: "1 week" },
    ],
    techniques: [
      {
        stage: 'System of Rice Intensification (SRI)',
        icon: Sprout,
        tip: 'Transplant young seedlings (15-20 days old) with wider spacing and careful water management.',
      },
      {
        stage: 'Integrated Nutrient Management',
        icon: TestTube2,
        tip: 'Combine organic manure (compost, etc.) with chemical fertilizers for balanced nutrition.',
      },
      {
        stage: 'Pest & Disease Management',
        icon: Bug,
        tip: 'Use resistant varieties and regularly monitor fields for early pest detection.',
      },
    ],
    mistakes: [
      {
        stage: 'Transplanting',
        issue: 'Transplanting seedlings that are too old.',
        why: 'Leads to poor tillering (fewer stems per plant) and reduced yield.',
        solution: 'Transplant seedlings when they are 15–20 days old for best results.',
      },
      {
        stage: 'Water Management',
        issue: 'Excessive or inadequate water levels.',
        why: 'Both extremes can severely affect growth and yield. Proper depth is crucial.',
        solution: 'Maintain a water depth of 3–5 cm for most growth stages. Allow slight drying where needed.',
      },
       {
        stage: 'Fertilization',
        issue: 'Overuse of chemical fertilizers.',
        why: 'Damages soil health in the long run and can cause nutrient imbalances.',
        solution: 'Use a balanced mix of organic compost and chemical fertilizers. Follow soil test recommendations.',
      },
    ],
  },
  pulses: {
    seasonalSuitability: {
      isSuitable: true,
      text: "Ideal for planting with residual moisture after rice harvest.",
    },
    weatherSuitability: {
      isSuitable: true,
      text: "Prefers cooler, dry weather for optimal growth.",
    },
    soilSuitability: {
        text: 'Grows well in well-drained loamy soils.',
    },
    roadmap: [
        { stage: 1, title: "Seed Treatment", duration: "Day 1" },
        { stage: 2, title: "Sowing", duration: "1 week" },
        { stage: 3, title: "Flowering", duration: "4-5 weeks" },
        { stage: 4, title: "Pod Development & Harvest", duration: "3-4 weeks" },
    ],
    techniques: [
        { stage: 'Rhizobium Inoculation', icon: Sprout, tip: 'Treat seeds with Rhizobium culture to improve nitrogen fixation and reduce fertilizer need.' },
        { stage: 'Intercropping', icon: Leaf, tip: 'Plant pulses with rice to utilize residual moisture after the rice harvest.' },
        { stage: 'Weed Control', icon: Bug, tip: 'Regular weeding and mulching are crucial to prevent yield loss.' },
    ],
    mistakes: [
        { stage: 'Watering', issue: 'Waterlogging the field.', why: 'Pulse crops are highly sensitive to excess water, which causes root rot.', solution: 'Ensure the field is well-drained. Avoid flood irrigation.' },
        { stage: 'Spacing', issue: 'Planting too densely.', why: 'Reduces air circulation, leading to fungal diseases and lower yield.', solution: 'Maintain proper spacing, typically 20–30 cm between rows.' },
    ],
  },
  vegetables: {
    seasonalSuitability: {
      isSuitable: true,
      text: "Can be grown year-round with proper water management.",
    },
    weatherSuitability: {
      isSuitable: true,
      text: "Raised beds are essential to protect from heavy rains.",
    },
    soilSuitability: {
        text: 'Thrives in fertile, well-drained loamy soil.',
    },
    roadmap: [
        { stage: 1, title: "Bed Preparation", duration: "1 week" },
        { stage: 2, title: "Planting", duration: "1-2 weeks" },
        { stage: 3, title: "Growth & Maintenance", duration: "4-8 weeks" },
        { stage: 4, title: "Harvesting", duration: "Ongoing" },
    ],
    techniques: [
        { stage: 'Raised Bed Farming', icon: Sprout, tip: 'Create raised beds 15–20 cm high to prevent waterlogging during rains.' },
        { stage: 'Mulching', icon: Leaf, tip: 'Apply mulch (straw, plastic) to retain soil moisture and control weeds effectively.' },
        { stage: 'Staking', icon: TestTube2, tip: 'Provide stakes for tomato and brinjal to improve air circulation and yield.' },
    ],
    mistakes: [
        { stage: 'Watering', issue: 'Overlooking drainage, causing waterlogging.', why: 'Leads to root rot and fungal diseases in most vegetables.', solution: 'Use raised beds and ensure drainage channels are clear.' },
        { stage: 'Spacing', issue: 'Overcrowding plants.', why: 'Limits sunlight exposure and increases pest and disease risk.', solution: 'Follow recommended spacing for each vegetable variety.' },
    ],
  },
  pokkali: {
    seasonalSuitability: {
      isSuitable: true,
      text: "Monsoon season is for saline-tolerant Pokkali rice.",
    },
    weatherSuitability: {
      isSuitable: false,
      text: "High tides expected. Check sluice gates to control saltwater intrusion.",
    },
    soilSuitability: {
        text: 'Unique saline coastal soils are required for this system.',
    },
    roadmap: [
        { stage: 1, title: "Rice Cultivation", duration: "Monsoon (4-5 months)" },
        { stage: 2, title: "Field Preparation for Prawns", duration: "2 weeks" },
        { stage: 3, title: "Prawn Farming", duration: "Post-Monsoon (4-6 months)" },
    ],
    techniques: [
        { stage: 'Rotational Farming', icon: Sprout, tip: 'Cultivate saline-tolerant Pokkali rice during monsoon, then introduce prawns after harvest.' },
        { stage: 'Water Management', icon: Droplets, tip: 'Use traditional sluice gates to carefully control the flow of saltwater and freshwater.' },
        { stage: 'Organic Manuring', icon: TestTube2, tip: 'Utilize natural decomposition of rice stubble to provide food for prawns.' },
    ],
    mistakes: [
        { stage: 'Salinity Management', issue: 'Poor control of salinity levels.', why: 'Can damage the rice crop or cause high mortality rates for prawns.', solution: 'Regularly monitor water salinity and use sluice gates effectively to manage it.' },
        { stage: 'Field Leveling', issue: 'Ignoring proper field leveling.', why: 'Leads to uneven water distribution, flooding, or dry patches.', solution: 'Ensure fields are properly leveled before starting cultivation.' },
    ],
  }
};

const soilSuitability: any = {
    'Alluvial': ['Paddy', 'Banana', 'Sugarcane', 'Vegetables'],
    'Lateritic': ['Coconut', 'Pepper', 'Cashew', 'Tapioca'],
    'Sandy': ['Coconut', 'Groundnut', 'Cucumber', 'Melons'],
    'Clay': ['Paddy', 'Vegetables', 'Banana'],
    'Loamy': ['Vegetables', 'Fruits', 'Paddy', 'Sugarcane'],
    'Sandy Loam': ['Groundnut', 'Pulses', 'Vegetables']
}

const keyTechniques = [
  {
    crop: 'Rice (Paddy)',
    icon: PaddyIcon,
    techniques: [
      'Traditional method → Fields are filled with water, seedlings are transplanted by hand.',
      'System of Rice Intensification (SRI) → Uses fewer seeds, wider spacing, and less water. This gives better yield with less cost.',
      'Integrated Pest & Nutrient Management → Farmers use organic manure + controlled chemical fertilizer + bio-control methods.',
    ],
    why: 'Rice is the staple food, but area has reduced. These methods help improve yield in limited land.',
  },
  {
    crop: 'Coconut',
    icon: Nut,
    techniques: [
      'Integrated Coconut Farming → Coconut trees are grown along with crops like banana, pepper, pineapple, or even with animals (goats, cows). This way, farmers earn from multiple sources.',
      'Fertigation & Organic Manures → Fertilizers are mixed with water and given directly to roots, along with compost/green manure.',
      'Trenching & Mulching → Trenches around the tree help water soak in, and mulching (covering soil with leaves) keeps moisture.',
    ],
    why: 'Kerala = “land of coconuts”, provides oil, coir, food.',
  },
  {
    crop: 'Rubber',
    icon: RubberIcon,
    techniques: [
      'Improved Clones → Farmers plant high-yielding rubber varieties (developed by Rubber Research Institute).',
      'Scientific Tapping → Special methods of cutting the bark to get maximum latex without damaging the tree.',
      'Intercropping in Early Years → Before rubber trees grow big, farmers grow pineapple, banana, or ginger in between rows.',
    ],
    why: 'Kerala produces >70% of India’s rubber.',
  },
  {
    crop: 'Spices',
    icon: Flower,
    techniques: [
      'Agroforestry System → Pepper is grown on trees (like coconut/arecanut), cardamom under shade, ginger in open fields.',
      'Organic Cultivation → Many farmers avoid chemicals since spices are for export.',
      'Trellis / Support Systems → For pepper vines to climb.',
      'Good Agricultural Practices (GAP) → Standard rules for drying, grading, and packaging to meet global quality.',
    ],
    why: 'Kerala is called “Spice Garden of India”.',
  },
  {
    crop: 'Tea & Coffee',
    icon: Coffee,
    techniques: [
      'Terrace Farming → Hills are cut into steps to prevent soil erosion.',
      'Shade Management → Coffee is grown under shade trees; tea requires open but carefully pruned bushes.',
      'Pruning & Green Manure → Regular pruning keeps bushes short and productive; green manure plants improve soil.',
    ],
    why: 'Kerala’s Idukki, Wayanad, and Munnar are famous for tea & coffee estates.',
  },
  {
    crop: 'Banana',
    icon: BananaIcon,
    techniques: [
      'Tissue-Culture Plants → Disease-free, uniform banana plants grown in labs and supplied to farmers.',
      'Integrated Pest & Disease Control → Farmers use neem extract, bio-pesticides, and sometimes chemicals.',
      'Mulching & Bunch Management → Covering soil with leaves for moisture; covering banana bunches with bags to improve quality.',
    ],
    why: 'Kerala bananas (like Nendran) are famous for chips and exports.',
  },
  {
    crop: 'Tapioca (Cassava)',
    icon: TapiocaIcon,
    techniques: [
      'Improved Varieties → High-yield, disease-resistant types from CTCRI (Central Tuber Crops Research Institute).',
      'Intercropping → Grown with coconut, banana, or vegetables to save land.',
      'Processing & Value Addition → Used for chips, starch, and biofuel.',
    ],
    why: 'Tapioca is a cheap staple food in rural Kerala.',
  },
  {
    crop: 'Cashew',
    icon: Nut,
    techniques: [
      'High-Density Planting → More trees planted per hectare.',
      'Grafting → Better varieties grafted onto local plants for higher yield.',
      'Organic & Export-Quality Production → Kerala cashew is famous worldwide, so farmers focus on quality.',
    ],
    why: 'Cashew industry = big export earner + gives jobs (especially to women in processing units).',
  },
];

const quickSummary = [
    { crop: "Rice", tech: "SRI + wetland farming + pest management." },
    { crop: "Coconut", tech: "Integrated farming + fertigation + mulching." },
    { crop: "Rubber", tech: "Improved clones + tapping + intercropping." },
    { crop: "Spices", tech: "Agroforestry + organic + GAP." },
    { crop: "Tea & Coffee", tech: "Terrace farming + shade management + pruning." },
    { crop: "Banana", tech: "Tissue culture + mulching + bunch care." },
    { crop: "Tapioca", tech: "Improved varieties + intercropping + processing." },
    { crop: "Cashew", tech: "High-density + grafting + organic for export." },
];

export default function AdvisorPage() {
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const { profile, isLoading: isAppLoading } = useApp();

  const cropData = selectedCrop ? mockData[selectedCrop] : null;

  if (isAppLoading || !profile) {
    return null; // The global loader in layout.tsx will be shown
  }

  const uniqueSoilTypes = [...new Set(profile.farmParcels.map(p => p.soilType))];


  return (
    <div className="space-y-8">
      <PageHeader
        title="Advisor"
        description="Get detailed guidance for wetland agriculture."
        icon={<Bot className="w-6 h-6 text-primary" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Wetland Crop Choices in {profile.village}</CardTitle>
            <CardDescription>Choose a crop to get tailored advice.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {crops.map((crop) => (
                    <button
                        key={crop.value}
                        onClick={() => setSelectedCrop(crop.value === selectedCrop ? null : crop.value)}
                        className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-lg border-2 text-center transition-all group",
                            selectedCrop === crop.value
                            ? "border-primary bg-primary/10"
                            : "border-transparent hover:bg-muted/50"
                        )}
                        >
                        <crop.icon className={cn("h-8 w-8 mb-2", selectedCrop === crop.value ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                        <span className="text-sm font-medium">{crop.label}</span>
                    </button>
                ))}
             </div>
             
             {selectedCrop && (
                <div className="animate-in fade-in-50 duration-500">
                    <Separator className="my-6" />
                    {cropData ? (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className={cn("flex items-center gap-4 p-4", cropData.seasonalSuitability.isSuitable ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200')}>
                                    <Sun className={cn("h-6 w-6", cropData.seasonalSuitability.isSuitable ? 'text-green-600' : 'text-yellow-600')} />
                                    <div>
                                        <h4 className="font-semibold">Seasonal Suitability</h4>
                                        <p className="text-sm text-muted-foreground">{cropData.seasonalSuitability.text}</p>
                                    </div>
                                </Card>
                                <Card className={cn("flex items-center gap-4 p-4", cropData.weatherSuitability.isSuitable ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200')}>
                                    <CloudRain className={cn("h-6 w-6", cropData.weatherSuitability.isSuitable ? 'text-green-600' : 'text-yellow-600')} />
                                    <div>
                                        <h4 className="font-semibold">Weather Suitability</h4>
                                        <p className="text-sm text-muted-foreground">{cropData.weatherSuitability.text}</p>
                                    </div>
                                </Card>
                                <Card className="flex items-center gap-4 p-4 bg-blue-50 border-blue-200">
                                    <Globe className="h-6 w-6 text-blue-600" />
                                    <div>
                                        <h4 className="font-semibold">Soil Suitability</h4>
                                        <p className="text-sm text-muted-foreground">{cropData.soilSuitability.text}</p>
                                    </div>
                                </Card>
                            </div>

                             <div>
                                <h2 className="font-headline text-2xl font-bold flex items-center gap-3 mb-4">
                                    <Map className="text-primary" /> Crop Roadmap
                                </h2>
                                <Card>
                                    <CardContent className="p-6 overflow-x-auto">
                                        <div className="flex items-start justify-between min-w-[600px]">
                                        {cropData.roadmap.map((step: any, index: number) => (
                                            <React.Fragment key={step.stage}>
                                            <div className="flex flex-col items-center text-center w-24">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mb-2">
                                                    {step.stage}
                                                </div>
                                                <p className="text-sm font-semibold">{step.title}</p>
                                                <p className="text-xs text-muted-foreground">{step.duration}</p>
                                            </div>
                                            {index < cropData.roadmap.length - 1 && (
                                                <Separator orientation="horizontal" className="flex-1 mt-5 mx-2 bg-primary/50" />
                                            )}
                                            </React.Fragment>
                                        ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                <div className="space-y-6">
                                    <h2 className="font-headline text-2xl font-bold flex items-center gap-3">
                                    <CheckCircle className="text-green-600" /> Top Farming Techniques
                                    </h2>
                                    {cropData.techniques.map((tech: any) => (
                                    <Card key={tech.stage}>
                                        <CardContent className="p-4 flex items-start gap-4">
                                            <div className="bg-primary/10 p-3 rounded-full">
                                                <tech.icon className="h-6 w-6 text-primary flex-shrink-0" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-base break-words">{tech.stage}</CardTitle>
                                                <p className="text-sm text-muted-foreground pr-4 break-words">{tech.tip}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    <h2 className="font-headline text-2xl font-bold flex items-center gap-3">
                                    <AlertTriangle className="text-yellow-500" /> Common Mistakes to Avoid
                                    </h2>
                                    <Accordion type="single" collapsible className="w-full">
                                    {cropData.mistakes.map((mistake: any, index: number) => (
                                        <AccordionItem value={`item-${index}`} key={index}>
                                        <AccordionTrigger className="text-left hover:no-underline p-4 bg-card rounded-lg border data-[state=open]:rounded-b-none">
                                            <div className="flex items-center gap-3">
                                                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                                                <span className="font-semibold">{mistake.issue}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="p-4 space-y-3 bg-card border border-t-0 rounded-b-lg">
                                            <div>
                                                <h4 className="font-semibold text-yellow-600 flex items-center gap-2"><Lightbulb size={16}/> Why it's harmful:</h4>
                                                <p className="text-sm text-muted-foreground pl-2">{mistake.why}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-green-600 flex items-center gap-2"><CheckCircle size={16}/> How to fix it:</h4>
                                                <p className="text-sm text-muted-foreground pl-2">{mistake.solution}</p>
                                            </div>
                                        </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                    </Accordion>
                                </div>
                            </div>

                             <Card className="border-yellow-400 bg-yellow-50 lg:col-span-3 mt-8">
                                <CardContent className="p-4">
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="p-3 bg-yellow-100 rounded-full">
                                            <Lightbulb className="h-6 w-6 text-yellow-600"/>
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h4 className="font-semibold text-yellow-800">Quick Takeaway</h4>
                                            <ul className="text-sm text-yellow-700 list-disc list-inside mt-1">
                                                <li>Water management is the most critical factor in wetlands.</li>
                                                <li>Proper spacing, seed selection, and organic care prevent most issues.</li>
                                                <li>Regular monitoring of pests, salinity, and weeds ensures healthy crops.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mt-4">Data Not Available</h3>
                            <p className="text-muted-foreground text-sm">
                                Detailed advisory for the selected crop is not yet available.
                            </p>
                        </div>
                    )}
                </div>
             )}
          </CardContent>
        </Card>
      </div>

        <Card className="border-primary/30 bg-primary/5 lg:col-span-3">
             <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <BrainCircuit className="h-6 w-6 text-primary"/>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                         <h4 className="font-semibold">Best Crop Choices for {profile.village}, Kerala</h4>
                         <p className="text-sm text-muted-foreground">Based on your soil and location, you could also consider growing <span className="font-medium text-primary">Ginger</span> or <span className="font-medium text-primary">Turmeric</span> for crop rotation.</p>
                    </div>
                    <Button size="sm" className="w-full sm:w-auto">Get Full Report</Button>
                </div>
             </CardContent>
        </Card>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-3">
            {uniqueSoilTypes.map((soilType) => (
                <Card key={soilType} className="bg-muted/40">
                <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                            <div>
                                <CardTitle>Soil: {soilType}</CardTitle>
                                <CardDescription>Suitability based on your profile.</CardDescription>
                            </div>
                            <Badge variant="secondary" className="text-sm whitespace-nowrap">
                                Parcel(s) with this soil
                            </Badge>
                        </div>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground flex-1">
                            This soil is generally suitable for crops like{' '}
                            <span className="font-semibold text-foreground">
                                {(soilSuitability[soilType as keyof typeof soilSuitability] || ['N/A']).join(', ')}.
                            </span>
                        </p>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">See All Suitable Crops</Button>
                </CardContent>
                </Card>
            ))}
        </div>
        
        <Separator className="my-4" />

        {/* Key Farming Techniques in Kerala Section */}
        <div className="space-y-6 lg:col-span-3">
             <PageHeader
                title="Key Farming Techniques in Kerala"
                description="Crop-wise techniques for better yield and sustainability."
            />
            <Card>
                <CardContent className="p-4 md:p-6">
                    <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                        {keyTechniques.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-left hover:no-underline p-4 font-semibold text-lg data-[state=open]:text-primary">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <span>{item.crop}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 space-y-4 bg-muted/30 border-l-4 border-primary/50 ml-4 pl-6">
                                <div>
                                    <h4 className="font-bold mb-2">Top Farming Techniques</h4>
                                    <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                                        {item.techniques.map((tech, i) => <li key={i}>{tech}</li>)}
                                    </ul>
                                </div>
                                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                                    <p className="text-sm font-medium text-green-800"><span className="font-bold">Why it's important:</span> {item.why}</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <ListChecks className="text-primary"/> Quick Summary for Revision
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {quickSummary.map(item => (
                        <div key={item.crop} className="flex items-start gap-3">
                            <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="font-bold">{item.crop}:</span>
                                <p className="text-sm text-muted-foreground inline"> {item.tech}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

