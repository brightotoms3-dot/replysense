'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/explain-why-reply-works.ts';
import '@/ai/flows/generate-reply-suggestions.ts';
import '@/ai/flows/generate-game-concept.ts';
