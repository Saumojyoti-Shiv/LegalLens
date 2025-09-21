'use server';

/**
 * @fileOverview This file defines a Genkit flow for explaining a selected clause in a legal document.
 *
 * - explainSelectedClause - A function that takes a clause and the document text and returns a plain-language explanation.
 * - ExplainSelectedClauseInput - The input type for the explainSelectedClause function.
 * - ExplainSelectedClauseOutput - The return type for the explainSelectedClause function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainSelectedClauseInputSchema = z.object({
  clause: z.string().describe('The specific clause selected by the user.'),
  documentText: z.string().describe('The full text of the legal document.'),
});
export type ExplainSelectedClauseInput = z.infer<typeof ExplainSelectedClauseInputSchema>;

const ExplainSelectedClauseOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A plain-language explanation of the selected clause.'),
});
export type ExplainSelectedClauseOutput = z.infer<typeof ExplainSelectedClauseOutputSchema>;

export async function explainSelectedClause(
  input: ExplainSelectedClauseInput
): Promise<ExplainSelectedClauseOutput> {
  return explainSelectedClauseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainSelectedClausePrompt',
  input: {schema: ExplainSelectedClauseInputSchema},
  output: {schema: ExplainSelectedClauseOutputSchema},
  prompt: `You are an expert legal assistant. Your task is to provide a clear and concise explanation of a specific clause from a legal document.

Here is the full legal document for context:
"""
{{{documentText}}}
"""

Here is the specific clause you need to explain:
"""
{{{clause}}}
"""

Provide a plain-language explanation of the selected clause, highlighting its key implications and obligations for the parties involved. Be direct and easy to understand.
`,
});

const explainSelectedClauseFlow = ai.defineFlow(
  {
    name: 'explainSelectedClauseFlow',
    inputSchema: ExplainSelectedClauseInputSchema,
    outputSchema: ExplainSelectedClauseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
