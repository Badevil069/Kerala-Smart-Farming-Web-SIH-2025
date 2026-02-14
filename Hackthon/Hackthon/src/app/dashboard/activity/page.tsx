'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import {
  Book,
  BrainCircuit,
  Calendar,
  Mic,
  Plus,
  Save,
  Trash2,
  Sprout,
  Droplets,
  TestTube2,
  Bug,
  SprayCan,
  Milestone,
  X,
  Upload,
  Camera,
  Lightbulb,
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
import { Textarea } from '@/components/ui/textarea';
import PageHeader from '@/components/shared/page-header';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const activitySchema = z.object({
  type: z.string(),
  crop: z.string().min(1, "Please select a crop."),
  parcel: z.string().min(1, "Please select a parcel."),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
  photo: z.any().optional(),
  quantity: z.string().optional(),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

const activityTypes = [
  { value: 'sowing', label: 'Sowing / Transplanting', icon: Sprout },
  { value: 'irrigation', label: 'Irrigation', icon: Droplets },
  { value: 'fertilizer', label: 'Fertilizer Application', icon: TestTube2 },
  { value: 'pest-issue', label: 'Pest / Disease Issue', icon: Bug },
  { value: 'spraying', label: 'Pesticide Spraying', icon: SprayCan },
  { value: 'harvest', label: 'Harvest', icon: Milestone },
];

const mockParcels = [
  { id: 'p1', name: 'North Field (2.5 acres)', crop: 'Paddy' },
  { id: 'p2', name: 'South Grove (1 acre)', crop: 'Coconut' },
];

const initialActivities = [
  { id: '1', type: 'sowing', date: '2024-07-20T10:30', notes: 'Sowed 1 acre of Uma variety paddy.', crop: 'Paddy', parcel: 'p1', photoUrl: 'https://picsum.photos/seed/sowing1/200/150' },
  { id: '2', type: 'irrigation', date: '2024-07-22T09:00', notes: 'Canal irrigation for 2 hours.', crop: 'Paddy', parcel: 'p1' },
  { id: '3', type: 'pest-issue', date: '2024-07-25T15:00', notes: 'Spotted leafhoppers on several plants.', crop: 'Paddy', parcel: 'p1', photoUrl: 'https://picsum.photos/seed/pest1/200/150' },
];

const smartSuggestions: { [key: string]: { message: string, trigger: string } } = {
  sowing: {
    trigger: 'Sowing Logged',
    message: 'Irrigate lightly for the first 7 days to ensure good germination.',
  },
  'pest-issue': {
    trigger: 'Pest Issue Logged',
    message: 'An expert from our team will review the photo and provide a detailed advisory soon.',
  },
  fertilizer: {
    trigger: 'Fertilizer Applied',
    message: 'The next recommended fertilizer dose is in 15 days. Would you like to set a reminder?',
  },
};


export default function ActivityPage() {
  const { toast } = useToast();
  const [activities, setActivities] = useState(initialActivities);
  const [isLogging, setIsLogging] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedActivityType, setSelectedActivityType] = useState<(typeof activityTypes)[0] | null>(null);
  const [lastSuggestion, setLastSuggestion] = useState<{ message: string, trigger: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      type: '',
      crop: '',
      parcel: '',
      date: new Date().toISOString().slice(0, 16),
      notes: '',
      quantity: '',
      photo: null,
    },
  });

  const handleActivitySelect = (activityType: (typeof activityTypes)[0]) => {
    setSelectedActivityType(activityType);
    form.reset({
      type: activityType.value,
      date: new Date().toISOString().slice(0, 16),
      crop: '',
      parcel: '',
      notes: '',
      quantity: '',
    });
    setImagePreview(null);
    setLastSuggestion(null);
    setIsFormOpen(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ActivityFormValues) => {
    setIsLogging(true);
    setTimeout(() => {
      const newActivity = {
        id: (activities.length + 1).toString(),
        ...data,
        date: new Date(data.date).toISOString(),
        photoUrl: imagePreview,
      };
      setActivities([newActivity, ...activities]);
      
      const suggestionKey = data.type === 'fertilizer' ? 'fertilizer' : data.type;
      const suggestion = smartSuggestions[suggestionKey];
      if (suggestion) {
        setLastSuggestion(suggestion);
      } else {
        setLastSuggestion(null);
      }

      toast({
        title: 'Activity Logged!',
        description: `${selectedActivityType?.label} activity has been saved.`,
      });

      setIsFormOpen(false);
      setIsLogging(false);
    }, 1500);
  };
  
  const requiresQuantity = selectedActivityType?.value === 'irrigation' || selectedActivityType?.value === 'fertilizer' || selectedActivityType?.value === 'harvest' || selectedActivityType?.value === 'spraying';
  const quantityLabel = selectedActivityType?.value === 'irrigation' ? 'Duration / Amount (e.g., 2 hours)' :
                        selectedActivityType?.value === 'fertilizer' ? 'Dosage / Amount (e.g., 50kg)' :
                        selectedActivityType?.value === 'spraying' ? 'Dosage / Amount (e.g., 2L)' :
                        selectedActivityType?.value === 'harvest' ? 'Yield Quantity (e.g., 500kg)' : 'Quantity';


  return (
    <div className="space-y-8">
      <PageHeader
        title="Activity Log"
        description="Keep a record of your farming activities."
        icon={<Book className="w-6 h-6 text-primary" />}
      />

      {/* Quick Entry */}
      <Card>
        <CardHeader>
          <CardTitle>Log a New Activity</CardTitle>
          <CardDescription>Select an activity type to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {activityTypes.map(activity => (
              <button
                key={activity.value}
                onClick={() => handleActivitySelect(activity)}
                className="flex flex-col items-center justify-center p-4 rounded-lg border-2 text-center transition-all hover:border-primary hover:bg-primary/10 group"
              >
                <activity.icon className="h-8 w-8 mb-2 text-primary/80 group-hover:text-primary" />
                <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">{activity.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Suggestion */}
      {lastSuggestion && (
         <Card className="border-primary/30 bg-primary/5 animate-in fade-in-50">
             <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Lightbulb className="h-6 w-6 text-primary"/>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                         <h4 className="font-semibold">{lastSuggestion.trigger}</h4>
                         <p className="text-sm text-muted-foreground">{lastSuggestion.message}</p>
                    </div>
                     {lastSuggestion.trigger.includes('reminder') && <Button size="sm">Set Reminder</Button>}
                </div>
             </CardContent>
        </Card>
      )}


      {/* Recent Activities Timeline */}
      <div className="space-y-6">
        <PageHeader title="Recent Activities" />
        <Card>
            <CardContent className="p-4 md:p-6">
                <div className="relative">
                    <div className="absolute left-4 h-full border-l-2 border-dashed border-border"></div>
                    {activities.length > 0 ? (
                        <ul className="space-y-8">
                            {activities.map(activity => {
                                const Icon = activityTypes.find(at => at.value === activity.type)?.icon || Book;
                                return (
                                <li key={activity.id} className="relative pl-12">
                                    <div className="absolute left-0 top-1.5 flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="bg-muted/40 p-4 rounded-lg">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                                            <p className="font-semibold">{activityTypes.find(at => at.value === activity.type)?.label} - <span className="font-normal">{activity.crop}</span></p>
                                            <p className="text-xs text-muted-foreground mt-1 sm:mt-0">{new Date(activity.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">{activity.notes || 'No details added.'}</p>
                                        {activity.photoUrl && (
                                            <Image 
                                                src={activity.photoUrl} 
                                                alt="Activity photo" 
                                                width={120} 
                                                height={90} 
                                                className="rounded-md object-cover" 
                                            />
                                        )}
                                    </div>
                                </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="text-center text-muted-foreground py-10 pl-12">
                            No activities logged yet.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>


      {/* Activity Entry Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
                {selectedActivityType && (
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                             <selectedActivityType.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Log {selectedActivityType.label}</DialogTitle>
                            <DialogDescription>Fill in the details for your activity.</DialogDescription>
                        </div>
                    </div>
                )}
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="crop" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Crop</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Paddy">Paddy</SelectItem>
                                    <SelectItem value="Coconut">Coconut</SelectItem>
                                    <SelectItem value="Banana">Banana</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="parcel" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Parcel</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select parcel" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {mockParcels.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="date" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Date & Time</FormLabel>
                        <FormControl>
                            <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                {requiresQuantity && (
                   <FormField control={form.control} name="quantity" render={({ field }) => (
                        <FormItem>
                            <FormLabel>{quantityLabel}</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 2.5 kg, 1 hour" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                )}

                <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Details / Notes</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Textarea placeholder="Add any relevant details..." {...field} />
                                <Button type="button" variant="ghost" size="icon" className="absolute bottom-2 right-2 h-7 w-7" onClick={() => toast({ title: 'Voice input coming soon!' })}>
                                    <Mic className="h-4 w-4" />
                                </Button>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormItem>
                    <FormLabel>Attach Photo (Optional)</FormLabel>
                    <div className="flex items-center gap-4">
                       {imagePreview && (
                          <div className="relative">
                            <Image src={imagePreview} alt="Preview" width={80} height={80} className="rounded-lg object-cover" />
                            <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => setImagePreview(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <FormControl>
                            <Input id="picture" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </FormControl>
                        <Button type="button" variant="outline" asChild>
                            <label htmlFor="picture" className="cursor-pointer">
                                <Upload className="mr-2 h-4 w-4" /> Upload
                            </label>
                        </Button>
                    </div>
                </FormItem>
                
                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLogging}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLogging ? 'Saving...' : 'Save Activity'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
