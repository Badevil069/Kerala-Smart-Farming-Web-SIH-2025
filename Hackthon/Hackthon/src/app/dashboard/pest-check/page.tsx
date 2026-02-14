'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Camera, Upload, CheckCircle, Leaf, AlertTriangle, Syringe, Shield, X, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/shared/page-header';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const mockAnalysis = {
  problem: 'Rice Gall Midge',
  cause: 'Caused by the insect Orseolia oryzae, which lays eggs on rice plants. The larvae bore into the stem, causing a gall to form, which prevents the panicle from emerging.',
  solution: 'Apply a systemic insecticide like Thiamethoxam 25% WG or Imidacloprid 17.8% SL. Follow the recommended dosage on the product label. Spray during the early morning or late evening.',
  prevention: 'Use resistant varieties of rice. Monitor fields regularly for silver shoots (galls). Maintain proper field sanitation and remove alternative host plants.'
};

const mockHistory = [
    {
        id: 'hist1',
        date: '2024-07-25',
        image: 'https://picsum.photos/seed/gall-midge/200/150',
        imageHint: 'rice disease',
        problem: 'Rice Gall Midge',
    },
    {
        id: 'hist2',
        date: '2024-07-18',
        image: 'https://picsum.photos/seed/leaf-spot/200/150',
        imageHint: 'leaf spot',
        problem: 'Brown Spot',
    }
];


export default function PestCheckPage() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<typeof mockAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysisResult(null); // Reset previous analysis
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = () => {
    if (!image) {
      toast({
        variant: 'destructive',
        title: 'No Image Selected',
        description: 'Please upload or take a photo of the affected crop first.',
      });
      return;
    }

    setIsAnalyzing(true);
    // Simulate API call to AI backend
    setTimeout(() => {
      setAnalysisResult(mockAnalysis);
      setIsAnalyzing(false);
      toast({
        title: 'Analysis Complete!',
        description: 'A potential problem has been identified.',
      });
    }, 2000);
  };

  const handleReset = () => {
    setImage(null);
    setAnalysisResult(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleViewHistory = (item: (typeof mockHistory)[0]) => {
    setImage(item.image);
    if (item.problem === mockAnalysis.problem) {
      setAnalysisResult(mockAnalysis);
    } else {
      // For the demo, we only have one detailed analysis.
      // You can extend this to fetch different analysis results.
      setAnalysisResult({
        problem: item.problem,
        cause: "Details for this problem are not available in this demo.",
        solution: "Please contact your local agricultural office for advice.",
        prevention: "Regular monitoring is always recommended."
      });
    }
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="space-y-8">
      <PageHeader
        title="Pest & Disease Check"
        description="Upload a photo of your crop to detect potential problems."
        icon={<Camera className="w-6 h-6 text-primary" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Upload Crop Image</CardTitle>
            <CardDescription>Take a clear photo of the affected leaf or plant.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full aspect-video border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 relative overflow-hidden">
              {image ? (
                <>
                  <Image src={image} alt="Uploaded crop" layout="fill" objectFit="contain" />
                   <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 rounded-full" onClick={handleReset}>
                      <X className="h-4 w-4" />
                   </Button>
                </>
              ) : (
                 <div className="text-center text-muted-foreground p-4">
                  <Upload className="mx-auto h-12 w-12" />
                  <p className="mt-2">Click below to upload or take a photo</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Upload Photo
                </Button>
                <Button onClick={() => fileInputRef.current?.click()}>
                    <Camera className="mr-2 h-4 w-4" /> Take Photo
                </Button>
            </div>

            {image && (
              <Button className="w-full" onClick={handleAnalyzeClick} disabled={isAnalyzing}>
                <CheckCircle className="mr-2 h-4 w-4" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="space-y-8">
            <Card>
            <CardHeader>
                <CardTitle>AI Analysis Result</CardTitle>
                <CardDescription>Review the diagnosis and recommended actions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isAnalyzing && (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                )}
                
                {!isAnalyzing && !analysisResult && (
                    <div className="text-center text-muted-foreground py-10">
                        <Leaf className="mx-auto h-12 w-12" />
                        <p className="mt-4">Analysis results will appear here.</p>
                    </div>
                )}

                {analysisResult && !isAnalyzing && (
                    <div className="space-y-6 animate-in fade-in-50">
                        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-destructive/20 rounded-full">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                </div>
                                <div>
                                <h3 className="font-bold text-lg text-destructive">{analysisResult.problem}</h3>
                                <p className="text-xs text-destructive/80 font-medium">Problem Detected</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-1"><Leaf size={18} className="text-primary"/> Cause</h3>
                                <p className="text-sm text-muted-foreground">{analysisResult.cause}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-1"><Syringe size={18} className="text-primary"/> Solution / Treatment</h3>
                                <p className="text-sm text-muted-foreground">{analysisResult.solution}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-1"><Shield size={18} className="text-primary"/> Prevention Advice</h3>
                                <p className="text-sm text-muted-foreground">{analysisResult.prevention}</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5"/>
                        Previous Analyses
                    </CardTitle>
                    <CardDescription>A log of your past pest and disease checks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {mockHistory.map(item => (
                            <li key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                                <Image 
                                    src={item.image} 
                                    alt={item.problem} 
                                    width={80} 
                                    height={60} 
                                    className="rounded-md object-cover w-full sm:w-20 h-auto"
                                    data-ai-hint={item.imageHint}
                                />
                                <div className="flex-1">
                                    <p className="font-semibold">{item.problem}</p>
                                    <p className="text-sm text-muted-foreground">{item.date}</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => handleViewHistory(item)} className="w-full sm:w-auto mt-2 sm:mt-0">View</Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
