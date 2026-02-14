// src/ai/flows/generate-crop-recommendations.ts
'use server';

/**
 * @fileOverview Generates crop recommendations based on farmer's profile.
 *
 * - generateCropRecommendations - A function that generates crop recommendations.
 * - GenerateCropRecommendationsInput - The input type for the generateCropRecommendations function.
 * - GenerateCropRecommendationsOutput - The return type for the generateCropRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCropRecommendationsInputSchema = z.object({
  soilType: z.string().describe('The type of soil the farmer has.'),
  location: z.string().describe('The location of the farm.'),
  historicalData: z.string().describe('Historical data about previous crops and yields.'),
});

export type GenerateCropRecommendationsInput = z.infer<typeof GenerateCropRecommendationsInputSchema>;

const GenerateCropRecommendationsOutputSchema = z.object({
  crops: z.array(z.string()).describe('A list of recommended crops.'),
  reasoning: z.string().describe('The reasoning behind the crop recommendations.'),
});

export type GenerateCropRecommendationsOutput = z.infer<typeof GenerateCropRecommendationsOutputSchema>;

export async function generateCropRecommendations(
  input: GenerateCropRecommendationsInput
): Promise<GenerateCropRecommendationsOutput> {
  return generateCropRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCropRecommendationsPrompt',
  input: {schema: GenerateCropRecommendationsInputSchema},
  output: {schema: GenerateCropRecommendationsOutputSchema},
  prompt: `You are an expert agricultural advisor for farmers in Kerala.
Based on the farmer's soil type, location, and historical data, recommend the best crops to plant.

Soil Type: {{{soilType}}}
Location: {{{location}}}
Historical Data: {{{historicalData}}}

Give a short paragraph explaining your reasoning behind these crop recommendations.
Output the crops as a simple array of strings.
`,
});

const generateCropRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateCropRecommendationsFlow',
    inputSchema: GenerateCropRecommendationsInputSchema,
    outputSchema: GenerateCropRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
