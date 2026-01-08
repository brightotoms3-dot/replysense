'use server';

/**
 * @fileOverview AI flow for generating graphic designs from a text prompt.
 *
 * - generateGraphicDesign - A function that generates an image.
 */

import { ai } from '@/ai/genkit';
import { GenerateGraphicDesignInputSchema, GenerateGraphicDesignOutputSchema, type GenerateGraphicDesignInput, type GenerateGraphicDesignOutput } from '@/lib/types';

export async function generateGraphicDesign(input: GenerateGraphicDesignInput): Promise<GenerateGraphicDesignOutput> {
  return generateGraphicDesignFlow(input);
}

const generateGraphicDesignFlow = ai.defineFlow(
  {
    name: 'generateGraphicDesignFlow',
    inputSchema: GenerateGraphicDesignInputSchema,
    outputSchema: GenerateGraphicDesignOutputSchema,
  },
  async ({ prompt }) => {
    const realisticPrompt = `Create a realistic graphic design as if a professional human designer made it.
    Prompt: "${prompt}".
    Style: photorealistic, high-resolution, detailed, modern design trends.`;

    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: realisticPrompt,
      config: {
        aspectRatio: '1:1',
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed.');
    }

    return {
      imageUrl: media.url,
    };
  }
);
