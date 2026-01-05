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
