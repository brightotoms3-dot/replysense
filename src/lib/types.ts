import { z } from 'zod';
import type { GenerateReplySuggestionsOutput } from '@/ai/flows/generate-reply-suggestions';
import type { GetConversationStartersOutput } from '@/ai/flows/crush-assistant';


export const CATEGORIES = ['Relationship', 'Work / Boss', 'School', 'Family', 'Friends'] as const;

export const ReplyFormSchema = z.object({
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

export type ReplyFormValues = z.infer<typeof ReplyFormSchema>;

export type AIResults = GenerateReplySuggestionsOutput;


// Crush Assistant Types
export const CrushAssistantFormSchema = z.object({
  photo: z.any().refine(file => file, "Please upload a photo."),
  naijaVibe: z.boolean(),
});

export type CrushAssistantFormValues = z.infer<typeof CrushAssistantFormSchema>;
export type CrushAssistantResults = GetConversationStartersOutput;
