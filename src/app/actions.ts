"use server";

import { 
  generateReplySuggestions, 
  type GenerateReplySuggestionsInput 
} from "@/ai/flows/generate-reply-suggestions";
import { 
  getConversationStarters,
  type GetConversationStartersInput
} from "@/ai/flows/crush-assistant";
import {
  analyzeConversationVibe,
  type VibeCheckInput,
} from "@/ai/flows/vibe-check-flow";
import {
  generateDateIdeas,
  type DatePlannerInput,
} from "@/ai/flows/date-idea-flow";
import {
  generateRizzLines,
  type RizzAssistantInput,
} from "@/ai/flows/rizz-assistant-flow";
import { 
  GetConversationStartersInputSchema,
  ReplyFormSchema,
  VibeCheckFormSchema,
  DatePlannerFormSchema,
  RizzAssistantFormSchema,
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

export async function analyzeVibe(input: VibeCheckInput) {
  const validatedInput = VibeCheckFormSchema.safeParse(input);

  if (!validatedInput.success) {
    throw new Error(`Invalid input: ${validatedInput.error.message}`);
  }

  try {
    const output = await analyzeConversationVibe(validatedInput.data);
    return output;
  } catch (error) {
    console.error("Error in analyzeVibe flow:", error);
    throw new Error("Failed to analyze vibe due to a server error.");
  }
}

export async function createDateIdeas(input: DatePlannerInput) {
  const validatedInput = DatePlannerFormSchema.safeParse(input);

  if (!validatedInput.success) {
    throw new Error(`Invalid input: ${validatedInput.error.message}`);
  }

  try {
    const output = await generateDateIdeas(validatedInput.data);
    return output;
  } catch (error) {
    console.error("Error in generateDateIdeas flow:", error);
    throw new Error("Failed to generate date ideas due to a server error.");
  }
}

export async function generateRizz(input: RizzAssistantInput) {
  const validatedInput = RizzAssistantFormSchema.safeParse(input);

  if (!validatedInput.success) {
    throw new Error(`Invalid input: ${validatedInput.error.message}`);
  }

  try {
    const output = await generateRizzLines(validatedInput.data);
    return output;
  } catch (error) {
    console.error("Error in generateRizz flow:", error);
    throw new Error("Failed to generate rizz lines due to a server error.");
  }
}
