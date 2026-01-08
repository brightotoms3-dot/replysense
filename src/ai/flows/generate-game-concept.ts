'use server';

/**
 * @fileOverview AI flow for generating a 3D game concept from a user's idea, including concept art.
 *
 * - generateGameConcept - A function that takes a user's idea and generates a game concept with an image.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateGameConceptInputSchema,
  GenerateGameConceptOutputSchema,
  type GenerateGameConceptInput,
  type GenerateGameConceptOutput,
} from '@/lib/types';

export async function generateGameConcept(input: GenerateGameConceptInput): Promise<GenerateGameConceptOutput> {
  return generateGameConceptFlow(input);
}

const conceptPrompt = ai.definePrompt({
  name: 'generateGameConceptPrompt',
  input: {schema: GenerateGameConceptInputSchema},
  output: {
    schema: z.object({
      title: z.string().describe('A creative and catchy title for the game.'),
      pitch: z.string().describe('A one-sentence pitch that summarizes the game.'),
      description: z
        .string()
        .describe(
          'A detailed paragraph describing the game concept, including gameplay mechanics, art style, and target audience.'
        ),
    }),
  },
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
    // 1. Generate the text concept first.
    const {output: concept} = await conceptPrompt(input);
    if (!concept) {
      throw new Error('Failed to generate game concept text.');
    }

    // 2. Generate the concept art based on the description.
    const imageGenPrompt = `Concept art for a 3D game titled "${concept.title}". Style: ${concept.description}. Pitch: ${concept.pitch}. High-quality, cinematic, detailed.`;
    
    const { media: image } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: imageGenPrompt,
    });
    
    const imageUrl = image?.url;
    if (!imageUrl) {
      throw new Error('Failed to generate game concept image.');
    }

    // 3. Return the combined output.
    return {
      ...concept,
      imageUrl,
    };
  }
);
