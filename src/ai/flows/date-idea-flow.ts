'use server';

/**
 * @fileOverview AI flow for generating date ideas.
 *
 * - generateDateIdeas - A function that generates date ideas based on user criteria.
 */

import { ai } from '@/ai/genkit';
import {
  DatePlannerInputSchema,
  DatePlannerOutputSchema,
  type DatePlannerInput,
  type DatePlannerOutput,
} from '@/lib/types';

export async function generateDateIdeas(
  input: DatePlannerInput
): Promise<DatePlannerOutput> {
  return dateIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dateIdeaPrompt',
  input: { schema: DatePlannerInputSchema },
  output: { schema: DatePlannerOutputSchema },
  prompt: `You are a creative and thoughtful date planner. Your task is to generate three unique and fun date ideas based on the user's preferences.

Preferences:
- Vibe: {{{vibe}}}
- Budget: {{{budget}}}
- Time of Day: {{{timeOfDay}}}

For each idea, provide a catchy title, a short description, and a few bullet points with specific details or tips to make the date special. Ensure the ideas are realistic and engaging.
`,
});

const dateIdeaFlow = ai.defineFlow(
  {
    name: 'dateIdeaFlow',
    inputSchema: DatePlannerInputSchema,
    outputSchema: DatePlannerOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('The AI model did not return an output.');
    }
    return output;
  }
);
