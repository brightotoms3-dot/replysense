"use server";

import { 
  generateReplySuggestions, 
  type GenerateReplySuggestionsInput, 
  type GenerateReplySuggestionsOutput 
} from "@/ai/flows/generate-reply-suggestions";
import { z } from "zod";

const ActionInputSchema = z.object({
  inputText: z.string(),
  category: z.enum(['Relationship', 'Work / Boss', 'School', 'Family', 'Friends']),
  screenshotDataUri: z.string().optional(),
});

export async function generateReplies(input: GenerateReplySuggestionsInput): Promise<GenerateReplySuggestionsOutput> {
  const validatedInput = ActionInputSchema.safeParse(input);

  if (!validatedInput.success) {
    throw new Error(`Invalid input: ${validatedInput.error.message}`);
  }

  try {
    const output = await generateReplySuggestions(validatedInput.data);
    return output;
  } catch (error) {
    console.error("Error in generateReplySuggestions flow:", error);
    throw new Error("Failed to generate replies due to a server error.");
  }
}
