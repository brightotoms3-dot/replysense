import { z } from 'zod';
import type { GenerateReplySuggestionsOutput } from '@/ai/flows/generate-reply-suggestions';

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
export const GetConversationStartersInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  naijaVibe: z.boolean().describe('Whether to use Nigerian slang in the suggestions.'),
});
export type GetConversationStartersInput = z.infer<typeof GetConversationStartersInputSchema>;

export const GetConversationStartersOutputSchema = z.object({
  starter1: z.string().describe('A friendly conversation starter.'),
  starter2: z.string().describe('A playful or confident conversation starter.'),
  starter3: z.string().describe('A safe and polite conversation starter.'),
  toneAdvice: z.string().describe('A short paragraph on how to approach the conversation.'),
  avoidThis: z.string().describe('A warning of what NOT to say.'),
});
export type GetConversationStartersOutput = z.infer<typeof GetConversationStartersOutputSchema>;

export const CrushAssistantFormSchema = z.object({
  photo: z.any().refine(file => file, "Please upload a photo."),
  naijaVibe: z.boolean(),
});

export type CrushAssistantFormValues = z.infer<typeof CrushAssistantFormSchema>;
export type CrushAssistantResults = GetConversationStartersOutput;
