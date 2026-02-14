'use server';

/**
 * @fileOverview An AI agent that enhances farmer activity logs with suggestions for improvement.
 *
 * - enhanceActivityLog - A function that takes activity log data and returns AI-driven suggestions.
 * - EnhanceActivityLogInput - The input type for the enhanceActivityLog function.
 * - EnhanceActivityLogOutput - The return type for the enhanceActivityLog function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceActivityLogInputSchema = z.object({
  activityType: z.string().describe('The type of farming activity (e.g., sowing, irrigation).'),
  activityDetails: z.string().describe('Detailed description of the farming activity performed.'),
  cropType: z.string().describe('The type of crop associated with the activity.'),
  soilType: z.string().describe('The type of soil the crop is planted in.'),
  irrigationMethod: z.string().describe('The irrigation method used for the crop.'),
  location: z.string().describe('Location where the farming activity occurred'),
});
export type EnhanceActivityLogInput = z.infer<typeof EnhanceActivityLogInputSchema>;

const EnhanceActivityLogOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('AI-driven suggestions for improving the farming activity.'),
  reasoning: z.string().describe('The AI agent’s reasoning behind the suggestions.'),
});
export type EnhanceActivityLogOutput = z.infer<typeof EnhanceActivityLogOutputSchema>;

export async function enhanceActivityLog(input: EnhanceActivityLogInput): Promise<EnhanceActivityLogOutput> {
  return enhanceActivityLogFlow(input);
}

const enhanceActivityLogPrompt = ai.definePrompt({
  name: 'enhanceActivityLogPrompt',
  input: {schema: EnhanceActivityLogInputSchema},
  output: {schema: EnhanceActivityLogOutputSchema},
  prompt: `You are an expert agricultural advisor for farmers in Kerala, India. Analyze the farmer's logged activity and suggest specific, actionable improvements to increase productivity, crop yield, and sustainability. Consider local climate conditions, common farming practices in Kerala, and potential environmental impacts.

Activity Type: {{{activityType}}}
Activity Details: {{{activityDetails}}}
Crop Type: {{{cropType}}}
Soil Type: {{{soilType}}}
Irrigation Method: {{{irrigationMethod}}}
Location: {{{location}}}

Based on these details, provide a list of specific suggestions for improvement and explain your reasoning. Format the suggestions as a numbered list.
`,
});

const enhanceActivityLogFlow = ai.defineFlow(
  {
    name: 'enhanceActivityLogFlow',
    inputSchema: EnhanceActivityLogInputSchema,
    outputSchema: EnhanceActivityLogOutputSchema,
  },
  async input => {
    const {output} = await enhanceActivityLogPrompt(input);
    return output!;
  }
);
