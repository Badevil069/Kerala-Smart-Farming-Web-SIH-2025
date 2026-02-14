'use server';

/**
 * @fileOverview Summarizes a farmer's activity logs using AI.
 *
 * - summarizeActivityLogs - A function that summarizes the activity logs.
 * - SummarizeActivityLogsInput - The input type for the summarizeActivityLogs function.
 * - SummarizeActivityLogsOutput - The return type for the summarizeActivityLogs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeActivityLogsInputSchema = z.object({
  activityLogs: z
    .string()
    .describe('The activity logs of the farmer, each entry separated by a newline.'),
});
export type SummarizeActivityLogsInput = z.infer<typeof SummarizeActivityLogsInputSchema>;

const SummarizeActivityLogsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the farmer activity logs.'),
});
export type SummarizeActivityLogsOutput = z.infer<typeof SummarizeActivityLogsOutputSchema>;

export async function summarizeActivityLogs(
  input: SummarizeActivityLogsInput
): Promise<SummarizeActivityLogsOutput> {
  return summarizeActivityLogsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeActivityLogsPrompt',
  input: {schema: SummarizeActivityLogsInputSchema},
  output: {schema: SummarizeActivityLogsOutputSchema},
  prompt: `You are an AI assistant helping farmers track their activities.

  Please provide a concise summary of the following activity logs:

  {{{activityLogs}}}
  `,
});

const summarizeActivityLogsFlow = ai.defineFlow(
  {
    name: 'summarizeActivityLogsFlow',
    inputSchema: SummarizeActivityLogsInputSchema,
    outputSchema: SummarizeActivityLogsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
