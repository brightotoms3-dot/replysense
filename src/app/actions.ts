"use server";

import { 
  generateReplySuggestions, 
  type GenerateReplySuggestionsInput 
} from "@/ai/flows/generate-reply-suggestions";
import {
  generateGraphicDesign,
} from "@/ai/flows/generate-graphic-design";
import { GenerateGraphicDesignInputSchema, type GenerateGraphicDesignInput } from "@/lib/types";
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

export async function createGraphicDesign(input: GenerateGraphicDesignInput) {
  const validatedInput = GenerateGraphicDesignInputSchema.safeParse(input);

  if (!validatedInput.success) {
    throw new Error(`Invalid input: ${validatedInput.error.message}`);
  }

  try {
    const output = await generateGraphicDesign(validatedInput.data);
    return output;
  } catch (error) {
    console.error("Error in generateGraphicDesign flow:", error);
    throw new Error("Failed to generate design due to a server error.");
  }
}
