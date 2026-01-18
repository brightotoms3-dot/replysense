'use server';

/**
 * @fileOverview AI flow for analyzing the vibe of a conversation.
 *
 * - analyzeConversationVibe - A function that analyzes a conversation and provides feedback.
 */

import { ai } from '@/ai/genkit';
import {
  VibeCheckInputSchema,
  VibeCheckOutputSchema,
  type VibeCheckInput,
  type VibeCheckOutput,
} from '@/lib/types';

export async function analyzeConversationVibe(
  input: VibeCheckInput
): Promise<VibeCheckOutput> {
  return vibeCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'vibeCheckPrompt',
  input: { schema: VibeCheckInputSchema },
  output: { schema: VibeCheckOutputSchema },
  prompt: `You are an expert in social dynamics and communication. Your task is to analyze a conversation and determine its "vibe".

The user has provided a text snippet and an optional screenshot of their conversation.

Conversation Text:
{{{conversation}}}

{{#if screenshotDataUri}}
Conversation Screenshot:
{{media url=screenshotDataUri}}
{{/if}}

Based on the content and context, analyze the following:
1.  **Overall Vibe**: Summarize the current dynamic in 2-4 words (e.g., "Flirty & Fun", "Getting Dry", "One-Sided", "Deep Connection").
2.  **Analysis**: Provide a short, insightful paragraph explaining your reasoning. What is the tone? The balance of the conversation? Is one person putting in more effort?
3.  **Next Step Suggestion**: Give a single, actionable suggestion for the user. Should they ask a specific type of question? Suggest a date? Or maybe pull back a bit?

Be honest, insightful, and supportive.
`,
});

const vibeCheckFlow = ai.defineFlow(
  {
    name: 'vibeCheckFlow',
    inputSchema: VibeCheckInputSchema,
    outputSchema: VibeCheckOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('The AI model did not return an output.');
    }
    return output;
  }
);
