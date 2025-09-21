'use server';

/**
 * @fileOverview A flow that detects risks and red flags in a legal document.
 *
 * - detectRisks - A function that analyzes a legal document for potential risks.
 * - DetectRisksInput - The input type for the detectRisks function.
 * - DetectRisksOutput - The return type for the detectRisks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectRisksInputSchema = z.object({
  documentText: z.string().describe('The text content of the legal document.'),
});
export type DetectRisksInput = z.infer<typeof DetectRisksInputSchema>;

const RiskItemSchema = z.object({
    clause: z.string().describe('The exact clause that contains the risk.'),
    risk: z.string().describe('A clear and concise explanation of the identified risk and its potential impact.'),
    severity: z.enum(['High', 'Medium', 'Low']).describe('The severity level of the risk (High, Medium, or Low).')
});

const DetectRisksOutputSchema = z.object({
  risks: z.array(RiskItemSchema).describe('An array of detected risks and red flags.'),
});
export type DetectRisksOutput = z.infer<typeof DetectRisksOutputSchema>;

export async function detectRisks(input: DetectRisksInput): Promise<DetectRisksOutput> {
  return detectRisksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectRisksPrompt',
  input: {schema: DetectRisksInputSchema},
  output: {schema: DetectRisksOutputSchema},
  prompt: `You are an expert legal analyst specializing in risk detection. Your task is to meticulously review the provided legal document and identify any clauses that could be disadvantageous or risky for a user.

Please look for:
- Unfair terms
- Hidden fees or costs
- Ambiguous language
- Clauses that waive user rights
- High-pressure tactics or strict, non-standard deadlines
- Anything that seems unusual or one-sided

For each risk you identify, provide the exact clause, a clear explanation of the risk, and a severity level (High, Medium, or Low).

Legal Document:
"""
{{{documentText}}}
"""

If there are no significant risks, return an empty array for the 'risks' field.
`,
});

const detectRisksFlow = ai.defineFlow(
  {
    name: 'detectRisksFlow',
    inputSchema: DetectRisksInputSchema,
    outputSchema: DetectRisksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
