"use server";

import { 
  generateReplySuggestions, 
  type GenerateReplySuggestionsInput, 
  type GenerateReplySuggestionsOutput 
} from "@/ai/flows/generate-reply-suggestions";
import {
  generateGameConcept,
  type GenerateGameConceptInput,
  type GenerateGameConceptOutput
} from "@/ai/flows/generate-game-concept";
import { z } from "zod";

const ReplyActionInputSchema = z.object({
  inputText: z.string(),
  category: z.enum(['Relationship', 'Work / Boss', 'School', 'Family', 'Friends']),
  screenshotDataUri: z.string().optional(),
});

export async function generateReplies(input: GenerateReplySuggestionsInput): Promise<GenerateReplySuggestionsOutput> {
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

const GameConceptActionInputSchema = z.object({
    idea: z.string(),
});

export async function generateGame(input: GenerateGameConceptInput): Promise<GenerateGameConceptOutput> {
    const validatedInput = GameConceptActionInputSchema.safeParse(input);

    if (!validatedInput.success) {
        throw new Error(`Invalid input: ${validatedInput.error.message}`);
    }

    try {
        const output = await generateGameConcept(validatedInput.data);
        return output;
    } catch (error) {
        console.error("Error in generateGameConcept flow:", error);
        throw new Error("Failed to generate game concept due to a server error.");
    }
}
