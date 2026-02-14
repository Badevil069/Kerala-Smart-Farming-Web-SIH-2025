
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type Language = 'en' | 'ml';

type FarmParcel = {
  landArea: number;
  crops: string;
  soilType: string;
  irrigationMethod: string;
}

type FarmerProfile = {
  name: string;
  village: string;
  location?: string;
  language?: Language;
  photoUrl?: string;
  farmParcels: FarmParcel[];
}

interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  profile: FarmerProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (profile: FarmerProfile) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const router = useRouter();


  useEffect(() => {
    // On initial load, try to get profile from localStorage
    try {
      const storedProfile = localStorage.getItem('farmerProfile');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile(parsedProfile);
        setLanguage(parsedProfile.language || 'en');
        setIsAuthenticated(true);
      }
    } catch (error) {
        console.error("Failed to parse farmer profile from localStorage", error);
        // Handle error, e.g. by clearing the stored item
        localStorage.removeItem('farmerProfile');
    } finally {
        setIsLoading(false); // Finished loading
    }
  }, []);

  const login = (profileData: FarmerProfile) => {
    const dataToStore = { ...profileData, language: profileData.language || language };
    localStorage.setItem('farmerProfile', JSON.stringify(dataToStore));
    setProfile(dataToStore);
    if(dataToStore.language) setLanguage(dataToStore.language);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('farmerProfile');
    setProfile(null);
    setIsAuthenticated(false);
    router.push('/login');
  };


  const value = {
    language,
    setLanguage,
    profile,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  const router = useRouter();
  const pathname = usePathname();
  
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }

  // Redirect if not authenticated and not on a public page
  useEffect(() => {
    // Wait until loading is finished
    if (context.isLoading) {
      return;
    }
    
    const publicPaths = ['/', '/login', '/profile/new']; // Add any other public paths here
    const isPublicPath = publicPaths.includes(pathname);

    // If user is authenticated and on login page, redirect to dashboard
    if (context.isAuthenticated && pathname === '/login') {
        router.push('/dashboard');
        return;
    }

    // If trying to access a protected route without being authenticated, redirect to login
    if (!context.isAuthenticated && !isPublicPath) {
        router.push('/login');
    }
    
  }, [context.isAuthenticated, context.isLoading, pathname, router]);


  return context;
};

export type { FarmerProfile, FarmParcel };
