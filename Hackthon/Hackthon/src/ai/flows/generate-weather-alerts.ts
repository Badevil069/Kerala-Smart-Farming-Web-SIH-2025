
'use server';

/**
 * @fileOverview Generates weather-based alerts for farmers.
 *
 * - generateWeatherAlerts - A function that creates weather alerts based on activities and forecasts.
 * - GenerateWeatherAlertsInput - The input type for the function.
 * - GenerateWeatherAlertsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ActivitySchema = z.object({
  activity: z.string().describe('The type of farming activity (e.g., sowing, pesticide spraying).'),
  crop: z.string().describe('The crop the activity was for.'),
  date: z.string().describe('When the activity occurred.'),
});

const GenerateWeatherAlertsInputSchema = z.object({
  recentActivities: z.array(ActivitySchema).describe('A list of recent farming activities.'),
  currentWeather: z.string().describe('A summary of the current weather forecast (e.g., temperature, chance of rain, wind speed).'),
  location: z.string().describe('The location of the farm (e.g., "Alappuzha, Kerala").'),
});

export type GenerateWeatherAlertsInput = z.infer<typeof GenerateWeatherAlertsInputSchema>;

const WeatherAlertSchema = z.object({
  title: z.string().describe('A short, clear title for the alert.'),
  description: z.string().describe('A detailed description of the alert and recommended action.'),
  severity: z.enum(['Low', 'Medium', 'High', 'Info']).describe('The severity of the alert.'),
});
export type WeatherAlert = z.infer<typeof WeatherAlertSchema>;


const GenerateWeatherAlertsOutputSchema = z.object({
  alerts: z.array(WeatherAlertSchema).describe('A list of generated weather alerts.'),
});

export type GenerateWeatherAlertsOutput = z.infer<typeof GenerateWeatherAlertsOutputSchema>;


export async function generateWeatherAlerts(input: GenerateWeatherAlertsInput): Promise<GenerateWeatherAlertsOutput> {
  return generateWeatherAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWeatherAlertsPrompt',
  input: { schema: GenerateWeatherAlertsInputSchema },
  output: { schema: GenerateWeatherAlertsOutputSchema },
  prompt: `You are an expert agricultural advisor in Kerala, India.
Your task is to generate actionable weather alerts for a farmer based on their recent activities and the current weather forecast.

Farmer's Location: {{{location}}}

Current Weather: {{{currentWeather}}}

Recent Activities:
{{#each recentActivities}}
- Activity: {{activity}}
- Crop: {{crop}}
- Date: {{date}}
{{/each}}

Based on the weather and activities, generate a list of 1-2 relevant alerts.
For example, if pesticide spraying just happened and rain is expected, create an alert warning that the pesticide might wash off.
If sowing just happened and strong winds are expected, warn about protecting seedlings.
If no specific action is required, you can return an empty list of alerts.
The alerts should be highly relevant to a farmer in the specified location.
`,
});

const generateWeatherAlertsFlow = ai.defineFlow(
  {
    name: 'generateWeatherAlertsFlow',
    inputSchema: GenerateWeatherAlertsInputSchema,
    outputSchema: GenerateWeatherAlertsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
