'use server';

/**
 * @fileOverview AI flow for generating reply suggestions based on user input.
 *
 * - generateReplySuggestions - A function that generates reply suggestions.
 * - GenerateReplySuggestionsInput - The input type for the generateReplySuggestions function.
 * - GenerateReplySuggestionsOutput - The return type for the generateReplySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReplySuggestionsInputSchema = z.object({
  inputText: z.string().describe('The message or situation text provided by the user.'),
  category: z
    .enum(['Relationship', 'Work / Boss', 'School', 'Family', 'Friends'])
    .describe('The category selected by the user to contextualize the input.'),
  screenshotDataUri:
    z.string()
      .optional()
      .describe(
        "An optional screenshot related to the message, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      ),
});
export type GenerateReplySuggestionsInput = z.infer<typeof GenerateReplySuggestionsInputSchema>;

const GenerateReplySuggestionsOutputSchema = z.object({
  politeReply: z.string().describe('A polite reply suggestion.'),
  confidentReply: z.string().describe('A confident reply suggestion.'),
  neutralReply: z.string().describe('A calm/neutral reply suggestion.'),
  explanation: z.string().describe('A short explanation of why these replies work.'),
});
export type GenerateReplySuggestionsOutput = z.infer<typeof GenerateReplySuggestionsOutputSchema>;

export async function generateReplySuggestions(
  input: GenerateReplySuggestionsInput
): Promise<GenerateReplySuggestionsOutput> {
  return generateReplySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReplySuggestionsPrompt',
  input: {schema: GenerateReplySuggestionsInputSchema},
  output: {schema: GenerateReplySuggestionsOutputSchema},
  prompt: `You are an AI assistant helping users craft appropriate replies to various situations. Given the user's input and the selected category, you will generate three distinct reply suggestions: one polite, one confident, and one neutral. Additionally, you will provide a brief explanation of why these replies are effective.

Category: {{{category}}}
Input Text: {{{inputText}}}
{{#if screenshotDataUri}}
Screenshot: {{media url=screenshotDataUri}}
{{/if}}

Format your response as follows:

Polite Reply: [A polite reply option]
Confident Reply: [A confident reply option]
Neutral Reply: [A calm/neutral reply option]
Explanation: [A short explanation of why these replies work. Be respectful, emotionally intelligent, and realistic. Avoid unsafe or manipulative advice.]`,
});

const generateReplySuggestionsFlow = ai.defineFlow(
  {
    name: 'generateReplySuggestionsFlow',
    inputSchema: GenerateReplySuggestionsInputSchema,
    outputSchema: GenerateReplySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
