
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Leaf,
  Phone,
  KeyRound,
  User,
  MapPin,
  Tractor,
  Wheat,
  Globe,
  Home,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/context/app-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LanguageToggle from '@/components/shared/language-toggle';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';

const LoginSchema = z.object({
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits.' }),
  otp: z.string().optional(),
  name: z.string().optional(),
  village: z.string().optional(),
  landArea: z.coerce.number().optional(),
  crops: z.string().optional(),
  soilType: z.string().optional(),
});

type LoginInputs = z.infer<typeof LoginSchema>;

const soilTypeKeys = ['Sandy', 'Loamy', 'Clay', 'Lateritic', 'Alluvial', 'Unknown'];

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp' | 'newUser' | 'newFarm'>(
    'phone'
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useApp();
  const { tStatic } = useTranslation();

  const form = useForm<LoginInputs>({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
    defaultValues: {
      phone: '',
      otp: '',
      name: '',
      village: '',
      landArea: '' as any,
      crops: '',
      soilType: '',
    },
  });

  const handlePrimaryAction: SubmitHandler<LoginInputs> = async (data) => {
    if (step === 'phone') {
      const isValid = await form.trigger('phone');
      if (!isValid) return;

      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep('otp');
      setIsLoading(false);
      toast({
        title: tStatic('login.otpSent'),
        description: tStatic('login.otpSentDesc'),
      });
    } else if (step === 'otp') {
      const isValid = await form.trigger('otp');
      if (!isValid || form.getValues('otp') !== '123456') {
        toast({
          variant: 'destructive',
          title: tStatic('login.invalidOtp'),
          description: tStatic('login.invalidOtpDesc'),
        });
        return;
      }

      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const isNewUser = form.getValues('phone').endsWith('0000');
      setIsLoading(false);

      if (isNewUser) {
        setStep('newUser');
      } else {
        login({
          name: 'Suresh Kumar',
          village: 'Kuttanad',
          location: '9.418, 76.433',
          language: 'ml',
          farmParcels: [
            {
              landArea: 2.5,
              crops: 'Paddy',
              soilType: 'Alluvial',
              irrigationMethod: 'Canal',
            },
            {
              landArea: 1,
              crops: 'Coconut, Banana',
              soilType: 'Lateritic',
              irrigationMethod: 'Well',
            },
          ],
        });
        toast({
          title: tStatic('login.loginSuccess'),
          description: tStatic('login.loginSuccessDesc'),
        });
        router.push('/dashboard');
      }
    } else if (step === 'newUser') {
      const isValid = await form.trigger(['name', 'village']);
      if (!isValid) return;
      setStep('newFarm');
    } else if (step === 'newFarm') {
      const isValid = await form.trigger(['landArea', 'crops', 'soilType']);
      if (!isValid) return;

      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newProfile = {
        name: data.name!,
        village: data.village!,
        language: 'ml',
        farmParcels: [
          {
            landArea: data.landArea!,
            crops: data.crops!,
            soilType: data.soilType!,
            irrigationMethod: 'Unknown',
          },
        ],
      };
      login(newProfile);

      toast({
        title: tStatic('login.profileCreated'),
        description: tStatic('login.profileCreatedDesc'),
      });
      router.push('/dashboard');
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return tStatic('login.processing');
    if (step === 'phone') return tStatic('login.sendOtp');
    if (step === 'otp') return tStatic('login.verifyOtp');
    if (step === 'newUser') return tStatic('login.newUser.nextButton');
    if (step === 'newFarm') return tStatic('login.newFarm.completeButton');
    return 'Continue';
  };

  const getTitle = () => {
    if (step === 'newUser') return tStatic('login.newUser.title');
    if (step === 'newFarm') return tStatic('login.newFarm.title');
    return tStatic('login.subtitle');
  }
  
  const phoneValidation = z.string().min(10, { message: tStatic('login.phoneError')});
  const otpValidation = z.string().min(6, { message: tStatic('login.otpErrorLength')});


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="absolute top-4 left-4">
        <Button variant="outline" asChild>
            <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                {tStatic('login.homeButton')}
            </Link>
        </Button>
      </div>
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full mb-4">
            <Leaf className="w-8 h-8" />
          </div>
          <CardTitle className="font-headline text-3xl">{tStatic('login.mainTitle')}</CardTitle>
          <CardDescription>
            {getTitle()}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePrimaryAction)}>
          <CardContent className="space-y-4">
            {step === 'phone' && (
              <FormField
                control={form.control}
                name="phone"
                rules={{ validate: value => phoneValidation.safeParse(value).success || tStatic('login.phoneError')}}
                render={({ field }) => (
                  <FormItem className="animate-in fade-in-50 duration-500">
                    <FormLabel>{tStatic('login.phoneLabel')}</FormLabel>
                     <FormControl>
                        <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="tel"
                            placeholder={tStatic('login.phonePlaceholder')}
                            className="pl-10"
                            {...field}
                            disabled={isLoading}
                        />
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {step === 'otp' && (
              <FormField
                control={form.control}
                name="otp"
                rules={{
                    required: tStatic('login.otpError'),
                    validate: value => otpValidation.safeParse(value).success || tStatic('login.otpErrorLength')
                }}
                render={({ field }) => (
                  <FormItem className="animate-in fade-in-50 duration-500">
                    <FormLabel>{tStatic('login.otpLabel')}</FormLabel>
                    <FormControl>
                        <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder={tStatic('login.otpPlaceholder')}
                            className="pl-10"
                            {...field}
                            disabled={isLoading}
                        />
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
            )}

            {step === 'newUser' && (
              <div className="space-y-4 animate-in fade-in-50 duration-500">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: tStatic('login.newUser.nameError') }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tStatic('login.newUser.nameLabel')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                            type="text"
                            placeholder={tStatic('login.newUser.namePlaceholder')}
                            className="pl-10"
                            {...field}
                            disabled={isLoading}
                            />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="village"
                  rules={{ required: tStatic('login.newUser.villageError') }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tStatic('login.newUser.villageLabel')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder={tStatic('login.newUser.villagePlaceholder')}
                          className="pl-10"
                          {...field}
                          disabled={isLoading}
                        />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 'newFarm' && (
              <div className="space-y-4 animate-in fade-in-50 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="landArea"
                    rules={{
                        required: tStatic('login.newFarm.landAreaError'),
                        min: { value: 0.1, message: tStatic('login.newFarm.landAreaMinError') },
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{tStatic('login.newFarm.landAreaLabel')}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                <Tractor className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="number"
                                    placeholder={tStatic('login.newFarm.landAreaPlaceholder')}
                                    className="pl-10"
                                    {...field}
                                    disabled={isLoading}
                                />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="crops"
                    rules={{ required: tStatic('login.newFarm.cropError')}}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{tStatic('login.newFarm.cropLabel')}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Wheat className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder={tStatic('login.newFarm.cropPlaceholder')}
                                        className="pl-10"
                                        {...field}
                                        disabled={isLoading}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                  />
                </div>
                 <FormField
                      control={form.control}
                      name="soilType"
                      rules={{ required: tStatic('login.newFarm.soilError') }}
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>{tStatic('login.newFarm.soilLabel')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <SelectTrigger className="pl-10">
                                        <SelectValue placeholder={tStatic('login.newFarm.soilPlaceholder')} />
                                    </SelectTrigger>
                                    </div>
                                </FormControl>
                                <SelectContent>
                                {soilTypeKeys.map((type) => (
                                    <SelectItem key={type} value={type}>
                                    {tStatic(`login.newFarm.soilTypes.${type}`)}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                             <FormMessage />
                        </FormItem>
                      )}
                    />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90"
              disabled={isLoading}
            >
              {getButtonText()}
            </Button>
            {step === 'newFarm' && (
               <Button type="button" variant="link" size="sm" onClick={() => setStep('newUser')} disabled={isLoading}>
                    {tStatic('login.newFarm.goBack')}
               </Button>
            )}
             {step === 'otp' && (
               <Button type="button" variant="link" size="sm" onClick={() => setStep('phone')} disabled={isLoading}>
                    {tStatic('login.changeNumber')}
               </Button>
            )}
          </CardFooter>
        </form>
        </Form>
      </Card>
      <p className="text-xs text-muted-foreground mt-4 text-center whitespace-pre-line">
        {tStatic('login.demoInfo')}
      </p>
    </main>
  );
}
