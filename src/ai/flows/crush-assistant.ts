'use server';

/**
 * @fileOverview AI flow for helping users start conversations with their crush.
 *
 * - getConversationStarters - A function that analyzes a photo and suggests conversation starters.
 * - GetConversationStartersInput - The input type for the function.
 * - GetConversationStartersOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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

export async function getConversationStarters(
  input: GetConversationStartersInput
): Promise<GetConversationStartersOutput> {
  return getConversationStartersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'crushAssistantPrompt',
  input: { schema: GetConversationStartersInputSchema },
  output: { schema: GetConversationStartersOutputSchema },
  prompt: `You are a confident, respectful social assistant that helps users start conversations with their crush.

The user has uploaded a photo of a person they want to talk to.
You must NOT identify the person or guess personal traits like age, sexuality, name, or identity.

Your task:
- Analyze only the visible context (clothing style, setting, mood, body language).
- Infer the general vibe (casual, confident, calm, stylish, friendly).
- Suggest conversation openers that are:
  • Respectful
  • Natural
  • Not creepy
  • Appropriate for first contact

{{#if naijaVibe}}
Use light Nigerian slang naturally in your suggestions. For example: "How far?", "Omo", "No wahala".
{{/if}}

User's crush photo: {{media url=photoDataUri}}

Keep everything short, human, and realistic.
`,
});

const getConversationStartersFlow = ai.defineFlow(
  {
    name: 'getConversationStartersFlow',
    inputSchema: GetConversationStartersInputSchema,
    outputSchema: GetConversationStartersOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('The AI model did not return an output.');
    }
    return output;
  }
);
