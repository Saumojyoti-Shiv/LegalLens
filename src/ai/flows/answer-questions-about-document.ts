'use server';

/**
 * @fileOverview A flow that answers questions about a legal document.
 *
 * - answerQuestionsAboutDocument - A function that answers questions about a legal document.
 * - AnswerQuestionsAboutDocumentInput - The input type for the answerQuestionsAboutDocument function.
 * - AnswerQuestionsAboutDocumentOutput - The return type for the answerQuestionsAboutDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsAboutDocumentInputSchema = z.object({
  documentText: z.string().describe('The text content of the legal document.'),
  question: z.string().describe('The question to be answered about the document.'),
});
export type AnswerQuestionsAboutDocumentInput = z.infer<typeof AnswerQuestionsAboutDocumentInputSchema>;

const AnswerQuestionsAboutDocumentOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the document.'),
});
export type AnswerQuestionsAboutDocumentOutput = z.infer<typeof AnswerQuestionsAboutDocumentOutputSchema>;

export async function answerQuestionsAboutDocument(input: AnswerQuestionsAboutDocumentInput): Promise<AnswerQuestionsAboutDocumentOutput> {
  return answerQuestionsAboutDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsAboutDocumentPrompt',
  input: {schema: AnswerQuestionsAboutDocumentInputSchema},
  output: {schema: AnswerQuestionsAboutDocumentOutputSchema},
  prompt: `You are a legal expert. Your task is to answer a specific question about the provided legal document.

Please carefully review the document text provided below and answer the following question based *only* on the information contained within the document.

Legal Document:
"""
{{{documentText}}}
"""

Question:
"{{{question}}}"

Provide a direct and concise answer to the question.
`,
});

const answerQuestionsAboutDocumentFlow = ai.defineFlow(
  {
    name: 'answerQuestionsAboutDocumentFlow',
    inputSchema: AnswerQuestionsAboutDocumentInputSchema,
    outputSchema: AnswerQuestionsAboutDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
