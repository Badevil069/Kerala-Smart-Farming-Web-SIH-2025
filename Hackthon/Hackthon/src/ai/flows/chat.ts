'use server';
/**
 * @fileOverview A conversational AI agent for the chatbot.
 *
 * - chat - A function that handles the chatbot conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
  message: z.string().describe('The latest message from the user.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  message: z.string().describe('The AI agent\'s response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `You are a friendly and helpful agricultural assistant chatbot for farmers in Kerala, India. Your name is Krishi Sakhi.

Your goal is to provide concise, accurate, and practical advice. Respond in the language of the user's query.

Here is the conversation history:
{{#each history}}
- {{role}}: {{{content}}}
{{/each}}

Here is the user's latest message:
- user: {{{message}}}

Based on this, provide a helpful response. If the user asks about logging an activity, ask them for details. If they ask about weather, give a simple forecast. For complex topics, suggest they consult the Advisor page.
`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const historyForPrompt = input.history.map(h => ({...h, role: h.role === 'user' ? 'user' : 'model'}));
    
    const llmResponse = await chatPrompt({
        history: historyForPrompt,
        message: input.message
    });
    
    return llmResponse.output!;
  }
);
