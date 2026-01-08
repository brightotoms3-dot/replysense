'use server';

/**
 * @fileOverview AI flow for helping users start conversations with their crush.
 *
 * - getConversationStarters - A function that analyzes a photo and suggests conversation starters.
 */

import { ai } from '@/ai/genkit';
import {
  GetConversationStartersInputSchema,
  GetConversationStartersOutputSchema,
  type GetConversationStartersInput,
  type GetConversationStartersOutput,
} from '@/lib/types';


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

{{#if vibe}}
Use light {{vibe}} slang and cultural references naturally in your suggestions. For example, if the vibe is 'Nigerian', you could use "How far?", "Omo", "No wahala". If the vibe is 'British', you might use "fancy a chat?" or "you alright?".
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
    // Don't pass the vibe if it's 'None' or undefined
    const promptInput = { ...input };
    if (promptInput.vibe === 'None') {
      promptInput.vibe = undefined;
    }

    const { output } = await prompt(promptInput);
    if (!output) {
      throw new Error('The AI model did not return an output.');
    }
    return output;
  }
);
