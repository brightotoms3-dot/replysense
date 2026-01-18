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
export const VIBES = ['None', 'Nigerian', 'American', 'British', 'Indian'] as const;

export const GetConversationStartersInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  vibe: z.string().optional().describe('The cultural vibe to use for the suggestions.'),
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
  vibe: z.enum(VIBES).optional(),
});

export type CrushAssistantFormValues = z.infer<typeof CrushAssistantFormSchema>;
export type CrushAssistantResults = GetConversationStartersOutput;

// Vibe Check Types
export const VibeCheckInputSchema = z.object({
  conversation: z.string().describe('The text of the conversation to analyze.'),
  screenshotDataUri: z
    .string()
    .optional()
    .describe(
      "An optional screenshot related to the message, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VibeCheckInput = z.infer<typeof VibeCheckInputSchema>;

export const VibeCheckOutputSchema = z.object({
    overallVibe: z.string().describe('A 2-4 word summary of the conversation vibe.'),
    analysis: z.string().describe('A short paragraph explaining the vibe analysis.'),
    nextStepSuggestion: z.string().describe('An actionable suggestion for the user.'),
});
export type VibeCheckOutput = z.infer<typeof VibeCheckOutputSchema>;
export type VibeCheckResults = VibeCheckOutput;

export const VibeCheckFormSchema = z.object({
    conversation: z.string().min(15, {
        message: 'Please paste at least 15 characters of conversation.',
    }),
    screenshot: z.any().optional(),
});
export type VibeCheckFormValues = z.infer<typeof VibeCheckFormSchema>;


// Date Planner Types
export const DATE_VIBES = ['Romantic', 'Casual', 'Adventurous', 'Chill', 'Foodie'] as const;
export const DATE_BUDGETS = ['Free', 'Cheap', 'Moderate', 'Fancy'] as const;
export const DATE_TIMES = ['Day', 'Night'] as const;

export const DatePlannerInputSchema = z.object({
  vibe: z.enum(DATE_VIBES),
  budget: z.enum(DATE_BUDGETS),
  timeOfDay: z.enum(DATE_TIMES),
});
export type DatePlannerInput = z.infer<typeof DatePlannerInputSchema>;
export const DatePlannerFormSchema = DatePlannerInputSchema;
export type DatePlannerFormValues = z.infer<typeof DatePlannerFormSchema>;


const DateIdeaSchema = z.object({
    title: z.string().describe('A catchy title for the date idea.'),
    description: z.string().describe('A short description of the date idea.'),
    details: z.array(z.string()).describe('A few bullet points with specific details or tips.'),
});

export const DatePlannerOutputSchema = z.object({
    ideas: z.array(DateIdeaSchema).describe('An array of three unique date ideas.'),
});
export type DatePlannerOutput = z.infer<typeof DatePlannerOutputSchema>;
export type DatePlannerResults = DatePlannerOutput;
