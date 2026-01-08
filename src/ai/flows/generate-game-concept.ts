'use server';

/**
 * @fileOverview AI flow for generating a 3D game concept from a user's idea.
 *
 * - generateGameConcept - A function that takes a user's idea and generates a game concept.
 */

import {ai} from '@/ai/genkit';
import { GenerateGameConceptInputSchema, GenerateGameConceptOutputSchema, type GenerateGameConceptInput, type GenerateGameConceptOutput } from '@/lib/types';


export async function generateGameConcept(input: GenerateGameConceptInput): Promise<GenerateGameConceptOutput> {
  return generateGameConceptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGameConceptPrompt',
  input: {schema: GenerateGameConceptInputSchema},
  output: {schema: GenerateGameConceptOutputSchema},
  prompt: `You are an expert 3D game designer. A user will provide you with a basic idea for a game. Your task is to flesh it out into a compelling game concept.

Game Idea: {{{idea}}}

Based on this idea, generate a creative title, a short and punchy one-sentence pitch, and a detailed description. The description should cover the core gameplay loop, the visual/art style, and the intended audience. Think about what would make this 3D game unique and fun.`,
});

const generateGameConceptFlow = ai.defineFlow(
  {
    name: 'generateGameConceptFlow',
    inputSchema: GenerateGameConceptInputSchema,
    outputSchema: GenerateGameConceptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
