'use server';

/**
 * @fileOverview Explains why a given reply works in a specific context.
 *
 * - explainWhyReplyWorks - A function that takes a reply and context and explains why it is effective.
 * - ExplainWhyReplyWorksInput - The input type for the explainWhyReplyWorks function.
 * - ExplainWhyReplyWorksOutput - The return type for the explainWhyReplyWorks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainWhyReplyWorksInputSchema = z.object({
  reply: z.string().describe('The reply to be explained.'),
  context: z.string().describe('The context in which the reply is used.'),
  category: z.string().describe('The category of the situation (e.g., Relationship, Work/Boss, School, Family, Friends).'),
});
export type ExplainWhyReplyWorksInput = z.infer<typeof ExplainWhyReplyWorksInputSchema>;

const ExplainWhyReplyWorksOutputSchema = z.object({
  explanation: z.string().describe('A short explanation of why the reply is effective in the given context.'),
});
export type ExplainWhyReplyWorksOutput = z.infer<typeof ExplainWhyReplyWorksOutputSchema>;

export async function explainWhyReplyWorks(input: ExplainWhyReplyWorksInput): Promise<ExplainWhyReplyWorksOutput> {
  return explainWhyReplyWorksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainWhyReplyWorksPrompt',
  input: {schema: ExplainWhyReplyWorksInputSchema},
  output: {schema: ExplainWhyReplyWorksOutputSchema},
  prompt: `You are an expert in communication and interpersonal relationships. Your task is to explain why a given reply is effective in a specific context.

  Category: {{{category}}}
  Context: {{{context}}}
  Reply: {{{reply}}}

  Provide a short, clear, and concise explanation of why this reply works in this situation. Focus on the emotional tone, intent, and potential impact of the reply. Be respectful, emotionally intelligent, and realistic.
  Do not mention that you are an AI.  Keep the explanation to 1-2 sentences.
  `,
});

const explainWhyReplyWorksFlow = ai.defineFlow(
  {
    name: 'explainWhyReplyWorksFlow',
    inputSchema: ExplainWhyReplyWorksInputSchema,
    outputSchema: ExplainWhyReplyWorksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
