"use server";

import { 
  generateReplySuggestions, 
  type GenerateReplySuggestionsInput 
} from "@/ai/flows/generate-reply-suggestions";
import { 
  getConversationStarters
} from "@/ai/flows/crush-assistant";
import { 
  GetConversationStartersInputSchema,
  ReplyFormSchema,
  type GetConversationStartersInput
} from "@/lib/types";

export async function generateReplies(input: GenerateReplySuggestionsInput) {
  const validatedInput = ReplyFormSchema.safeParse(input);

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

export async function createConversationStarters(input: GetConversationStartersInput) {
  const validatedInput = GetConversationStartersInputSchema.safeParse(input);

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
