'use server';

/**
 * @fileOverview A flow that compares two legal documents and highlights key differences.
 *
 * - compareDocuments - A function that analyzes and compares two legal documents.
 * - CompareDocumentsInput - The input type for the compareDocuments function.
 * - CompareDocumentsOutput - The return type for the compareDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompareDocumentsInputSchema = z.object({
  documentTextA: z.string().describe('The text content of the first legal document (Document A).'),
  documentTextB: z.string().describe('The text content of the second legal document (Document B).'),
});
export type CompareDocumentsInput = z.infer<typeof CompareDocumentsInputSchema>;


const ComparisonPointSchema = z.object({
    topic: z.string().describe("The specific topic being compared (e.g., 'Interest Rate', 'Penalty Clause', 'Termination')."),
    summaryA: z.string().describe("A summary of how Document A addresses the topic."),
    summaryB: z.string().describe("A summary of how Document B addresses the topic."),
    verdict: z.string().describe("A concluding verdict on the comparison for this topic, highlighting which document might be more favorable to the user and why."),
});

const CompareDocumentsOutputSchema = z.object({
  comparison: z.array(ComparisonPointSchema).describe('An array of key differences found between the two documents.'),
});
export type CompareDocumentsOutput = z.infer<typeof CompareDocumentsOutputSchema>;


export async function compareDocuments(input: CompareDocumentsInput): Promise<CompareDocumentsOutput> {
  return compareDocumentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareDocumentsPrompt',
  input: {schema: CompareDocumentsInputSchema},
  output: {schema: CompareDocumentsOutputSchema},
  prompt: `You are an expert legal analyst. Your task is to compare two legal documents side-by-side and highlight the key differences.

Focus on critical aspects such as:
- Interest rates, fees, and payment schedules
- Penalties for late payments or defaults
- Obligations and responsibilities of each party
- Termination clauses and conditions
- Confidentiality and liability terms
- Any other significant differences that would impact a user's decision.

For each key difference you find, create a comparison point. Provide a summary for each document on that topic and a final verdict on which is more favorable.

Document A:
"""
{{{documentTextA}}}
"""

Document B:
"""
{{{documentTextB}}}
"""

If the documents are very similar and have no significant differences, return an empty array for the 'comparison' field.
`,
});

const compareDocumentsFlow = ai.defineFlow(
  {
    name: 'compareDocumentsFlow',
    inputSchema: CompareDocumentsInputSchema,
    outputSchema: CompareDocumentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
