'use server';

/**
 * @fileOverview AI flow for generating "rizz" or lines to woo someone.
 *
 * - generateRizzLines - A function that generates witty, flirty, or charming lines.
 */

import { ai } from '@/ai/genkit';
import {
  RizzAssistantInputSchema,
  RizzAssistantOutputSchema,
  type RizzAssistantInput,
  type RizzAssistantOutput,
} from '@/lib/types';

export async function generateRizzLines(
  input: RizzAssistantInput
): Promise<RizzAssistantOutput> {
  return rizzAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rizzAssistantPrompt',
  input: { schema: RizzAssistantInputSchema },
  output: { schema: RizzAssistantOutputSchema },
  prompt: `You are a charismatic and witty dating coach, a "Rizz God". Your task is to help a user craft the perfect reply to woo someone they are interested in.

You need to generate two distinct suggestions based on the user's desired vibe and the context of the conversation.

**Scenario**: {{{scenario}}}
**Desired Vibe**: {{{vibe}}}

**Conversation Context**:
{{#if conversationContext}}
Summary of chat so far: {{{conversationContext}}}
{{else}}
This is the start of the conversation.
{{/if}}

**Their Last Message**:
"{{{lastMessage}}}"

Your goal is to be smooth, creative, and respectful. Avoid anything that is creepy, generic, or overly aggressive. The lines should sound natural and confident. Also provide a brief explanation for why the lines are effective.
`,
});

const rizzAssistantFlow = ai.defineFlow(
  {
    name: 'rizzAssistantFlow',
    inputSchema: RizzAssistantInputSchema,
    outputSchema: RizzAssistantOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('The AI model did not return an output.');
    }
    return output;
  }
);
