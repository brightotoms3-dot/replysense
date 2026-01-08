import { z } from 'zod';
import type { GenerateReplySuggestionsOutput } from '@/ai/flows/generate-reply-suggestions';

export const CATEGORIES = ['Relationship', 'Work / Boss', 'School', 'Family', 'Friends'] as const;

export const FormSchema = z.object({
  inputText: z
    .string({
      required_error: 'Please describe the situation.',
    })
    .min(10, 'Please describe the situation in at least 10 characters.'),
  category: z.enum(CATEGORIES, {
    required_error: 'Please select a category.',
  }),
  screenshot: z.any().optional(),
});

export type FormValues = z.infer<typeof FormSchema>;

export type AIResults = GenerateReplySuggestionsOutput;

// Game Concept Generation
export const GenerateGameConceptInputSchema = z.object({
  idea: z.string().describe("The user's core idea for the 3D game."),
});
export type GenerateGameConceptInput = z.infer<typeof GenerateGameConceptInputSchema>;

export const GenerateGameConceptOutputSchema = z.object({
  title: z.string().describe('A creative and catchy title for the game.'),
  pitch: z.string().describe('A one-sentence pitch that summarizes the game.'),
  description: z.string().describe('A detailed paragraph describing the game concept, including gameplay mechanics, art style, and target audience.'),
});
export type GenerateGameConceptOutput = z.infer<typeof GenerateGameConceptOutputSchema>;

export const GameConceptActionInputSchema = z.object({
    idea: z.string(),
});
