

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, MapPin, Tractor, Wheat, Droplets, Globe, Plus, Trash2, LocateFixed, Phone, Languages, Edit, Save, Home, UploadCloud } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/app-context';
import LanguageToggle from '@/components/shared/language-toggle';


const parcelSchema = z.object({
  landArea: z.coerce.number().min(0.1, "Land area must be positive"),
  crops: z.string().min(2, "At least one crop is required"),
  soilType: z.string().min(3, "Soil type is required"),
  irrigationMethod: z.string().min(3, "Irrigation method is required"),
});

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  village: z.string().min(2, 'Village/Panchayat is required'),
  location: z.string().optional(),
  language: z.string().optional(),
  photoUrl: z.string().optional(),
  farmParcels: z.array(parcelSchema).min(1, 'Please add at least one farm parcel.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const soilTypes = ['Sandy', 'Loamy', 'Clay', 'Lateritic', 'Alluvial', 'Unknown'];
const irrigationMethods = ['Rainfed', 'Canal', 'Well', 'Drip', 'Sprinkler'];

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { profile, login, isAuthenticated, isLoading: isAppLoading } = useApp();

  const [isSaving, setIsSaving] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(profile?.photoUrl || null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
        name: '',
        village: '',
        location: '',
        language: 'en',
        photoUrl: 'https://picsum.photos/seed/farmer/100/100',
        farmParcels: [],
    },
  });

  useEffect(() => {
    // This effect runs only once to check authentication and redirect if necessary
    if (!isAppLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAppLoading, isAuthenticated, router]);

  useEffect(() => {
    // This effect runs when the profile data changes, to reset the form
    if (profile) {
      form.reset(profile);
      setImagePreview(profile.photoUrl || 'https://picsum.photos/seed/farmer/100/100');
      if (profile.farmParcels.length === 0) {
        setIsEditing(true);
      }
    }
  }, [profile, form]);


  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "farmParcels"
  });

  const handleDetectLocation = () => {
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        form.setValue('location', `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        setIsDetecting(false);
        toast({ title: "Location Detected!", description: "Your GPS coordinates have been captured." });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsDetecting(false);
        toast({ variant: 'destructive', title: "Location Error", description: "Could not detect your location."});
      }
    );
  };
  
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('photoUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };


  async function onSubmit(data: ProfileFormValues) {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    login(data);

    setIsSaving(false);
    toast({
      title: 'Profile Saved!',
      description: `Your farming profile has been updated.`,
    });
    
    setIsEditing(false);
  }
  
  if (isAppLoading || !profile) {
    return null; // The global loader in layout.tsx will be shown
  }

  return (
      <Card className="w-full max-w-lg mx-auto my-6 relative">
         <div className="absolute top-4 right-4 z-10">
            <LanguageToggle />
        </div>
        <CardHeader>
             <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                 <div className="text-center sm:text-left flex-1">
                    <CardTitle className="font-headline text-3xl">
                        Your Profile
                    </CardTitle>
                    <CardDescription>
                        View or edit your farm details.
                    </CardDescription>
                 </div>
                 <Button variant="outline" asChild className="w-full sm:w-auto">
                    <Link href="/dashboard">
                        <Home className="mr-2 h-4 w-4" />
                        <span className="sm:inline">Dashboard</span>
                    </Link>
                </Button>
            </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                         <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full">
                            <div className="relative">
                                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-primary/20">
                                    <AvatarImage src={imagePreview || "https://picsum.photos/seed/farmer/100/100"} data-ai-hint="farmer portrait" />
                                    <AvatarFallback>{form.watch('name')?.substring(0,2).toUpperCase() || 'F'}</AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                     <>
                                        <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                        <label htmlFor="photo-upload" className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground p-2 rounded-full cursor-pointer hover:bg-accent/90 transition-colors">
                                             <UploadCloud className="h-4 w-4" />
                                        </label>
                                    </>
                                )}
                            </div>
                            <div className="text-center sm:text-left">
                                <h2 className="text-2xl sm:text-3xl font-bold font-headline">{form.watch('name') || 'Farmer Name'}</h2>
                                <p className="text-muted-foreground">{form.watch('village') || 'Village'}</p>
                            </div>
                        </div>
                        {!isEditing && (
                            <Button type="button" variant="outline" onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                                <Edit className="mr-2 h-4 w-4" /> Edit Profile
                            </Button>
                        )}
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input disabled={!isEditing} className={cn("pl-10", !isEditing && 'text-foreground/90 disabled:cursor-default')} placeholder="e.g., Suresh Kumar" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input className={cn("pl-10", 'text-foreground/90 disabled:cursor-default')} placeholder="Pre-filled from login" disabled value="+91 9xxxxxx000" />
                                </div>
                            </FormControl>
                        </FormItem>
                         <FormField
                        control={form.control}
                        name="village"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Village / Panchayat</FormLabel>
                            <FormControl>
                                <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input disabled={!isEditing} className={cn("pl-10", !isEditing && 'text-foreground/90 disabled:cursor-default')} placeholder="e.g., Kuttanad" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                           <FormItem>
                                <FormLabel>GPS Location</FormLabel>
                                <div className="flex gap-2">
                                    <FormControl>
                                        <Input disabled className={cn("flex-1", 'text-foreground/90 disabled:cursor-default')} {...field} placeholder="Not set"/>
                                    </FormControl>
                                    <Button type="button" variant="outline" onClick={handleDetectLocation} disabled={isDetecting || !isEditing} className="px-3 sm:px-4">
                                        <LocateFixed className="h-4 w-4 sm:mr-2"/>
                                        <span className="hidden sm:inline">
                                            {isDetecting ? '...' : 'Detect'}
                                        </span>
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                          control={form.control}
                          name="language"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Language Preference</FormLabel>
                              <Select disabled={!isEditing} onValueChange={field.onChange} value={field.value} defaultValue="ml">
                                <FormControl>
                                  <div className="relative">
                                    <Languages className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <SelectTrigger className={cn("pl-10", !isEditing && 'text-foreground/90 disabled:cursor-default')}>
                                      <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                  </div>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="ml">Malayalam</SelectItem>
                                    <SelectItem value="en">English</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>
                </div>

                <Separator />
                
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h3 className="text-lg font-headline font-semibold">Farm & Land Details</h3>
                        {isEditing && (
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ landArea: 1, crops: '', soilType: '', irrigationMethod: '' })} className="w-full sm:w-auto">
                                <Plus className="mr-2 h-4 w-4" /> Add Farm Parcel
                            </Button>
                        )}
                    </div>

                     {fields.map((field, index) => (
                        <Card key={field.id} className="p-4 relative bg-muted/30">
                            <CardHeader className="p-2">
                                <CardTitle className="text-base">Farm Parcel #{index + 1}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <FormField
                                        control={form.control}
                                        name={`farmParcels.${index}.landArea`}
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Land Area (in acres)</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                <Tractor className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input disabled={!isEditing} className={cn("pl-10", !isEditing && 'text-foreground/90 disabled:cursor-default')} type="number" step="0.1" placeholder="e.g., 2.5" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                    <FormField
                                        control={form.control}
                                        name={`farmParcels.${index}.crops`}
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Main Crop(s)</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                <Wheat className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input disabled={!isEditing} className={cn("pl-10", !isEditing && 'text-foreground/90 disabled:cursor-default')} placeholder="e.g., Paddy, Coconut" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                    <FormField
                                        control={form.control}
                                        name={`farmParcels.${index}.soilType`}
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Soil Type</FormLabel>
                                            <Select disabled={!isEditing} onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                <div className="relative">
                                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <SelectTrigger className={cn("pl-10", !isEditing && 'text-foreground/90 disabled:cursor-default')}>
                                                    <SelectValue placeholder="Select a soil type" />
                                                    </SelectTrigger>
                                                </div>
                                                </FormControl>
                                                <SelectContent>
                                                {soilTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                    <FormField
                                        control={form.control}
                                        name={`farmParcels.${index}.irrigationMethod`}
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Irrigation Method</FormLabel>
                                            <Select disabled={!isEditing} onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                <div className="relative">
                                                    <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <SelectTrigger className={cn("pl-10", !isEditing && 'text-foreground/90 disabled:cursor-default')}>
                                                    <SelectValue placeholder="Select an irrigation method" />
                                                    </SelectTrigger>
                                                </div>
                                                </FormControl>
                                                <SelectContent>
                                                {irrigationMethods.map((method) => (
                                                    <SelectItem key={method} value={method}>{method}</SelectItem>
                                                ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                </div>
                            </CardContent>
                             {isEditing && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7"
                                    onClick={() => remove(index)}
                                    >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                             )}
                        </Card>
                     ))}
                     {form.formState.errors.farmParcels?.root && <p className="text-sm font-medium text-destructive">{form.formState.errors.farmParcels.root.message}</p>}
                </div>

                {isEditing && (
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end pt-4 gap-4">
                        <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => { setIsEditing(false); form.reset(profile); }}>
                           Cancel
                        </Button>
                        <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 w-full sm:w-auto" disabled={isSaving}>
                            <Save className="mr-2 h-4 w-4"/>
                            {isSaving ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </div>
                )}
            </form>
          </Form>
        </CardContent>
      </Card>
  );
}
