'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-legal-document.ts';
import '@/ai/flows/explain-selected-clause.ts';
import '@/ai/flows/answer-questions-about-document.ts';
import '@/ai/flows/detect-risks.ts';
import '@/ai/flows/check-compliance.ts';
import '@/ai/flows/compare-documents.ts';
