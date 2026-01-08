"use server";

import { 
  generateReplySuggestions, 
  type GenerateReplySuggestionsInput 
} from "@/ai/flows/generate-reply-suggestions";
import { 
  getConversationStarters,
  type GetConversationStartersInput
} from "@/ai/flows/crush-assistant";
import { z } from "zod";

const ReplyActionInputSchema = z.object({
  inputText: z.string(),
  category: z.enum(['Relationship', 'Work / Boss', 'School', 'Family', 'Friends']),
  screenshotDataUri: z.string().optional(),
});

export async function generateReplies(input: GenerateReplySuggestionsInput) {
  const validatedInput = ReplyActionInputSchema.safeParse(input);

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


const CrushAssistantInputSchema = z.object({
  photoDataUri: z.string(),
  naijaVibe: z.boolean(),
});

export async function createConversationStarters(input: GetConversationStartersInput) {
  const validatedInput = CrushAssistantInputSchema.safeParse(input);

  if (!validatedInput.success) {
    throw new Error(`Invalid input: ${validatedInput.error.message}`);
  }

  try {
    const output = await getConversationStarters(validatedInput.data);
    return output;
  } catch (error) {
    console.error("Error in getConversationStarters flow:", error);
    throw new Error("Failed to generate conversation starters due to a server error.");
  }
}