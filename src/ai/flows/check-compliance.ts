'use server';

/**
 * @fileOverview A flow that checks a legal document for compliance issues with Indian law.
 *
 * - checkCompliance - A function that analyzes a legal document for compliance violations.
 * - CheckComplianceInput - The input type for the checkCompliance function.
 * - CheckComplianceOutput - The return type for the checkCompliance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckComplianceInputSchema = z.object({
  documentText: z.string().describe('The text content of the legal document.'),
});
export type CheckComplianceInput = z.infer<typeof CheckComplianceInputSchema>;

const ComplianceIssueSchema = z.object({
    law: z.string().describe('The specific Indian law or regulation that is being violated.'),
    clause: z.string().describe('The exact clause that contains the potential compliance issue.'),
    issue: z.string().describe('A clear and concise explanation of the identified compliance issue and why it might be problematic under the specified Indian law.'),
    recommendation: z.string().describe('A suggested action or recommendation for the user to address the issue.'),
});

const CheckComplianceOutputSchema = z.object({
  complianceIssues: z.array(ComplianceIssueSchema).describe('An array of detected compliance issues.'),
});
export type CheckComplianceOutput = z.infer<typeof CheckComplianceOutputSchema>;

export async function checkCompliance(input: CheckComplianceInput): Promise<CheckComplianceOutput> {
  return checkComplianceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkCompliancePrompt',
  input: {schema: CheckComplianceInputSchema},
  output: {schema: CheckComplianceOutputSchema},
  prompt: `You are an expert legal compliance analyst specializing in Indian Law. Your task is to review the provided legal document and check for clauses that may violate Indian laws, regulations, or consumer protection standards.

Please look for:
- Terms that are potentially illegal or unenforceable under Indian contract law.
- Clauses that violate consumer rights (e.g., unfair contract terms under the Consumer Protection Act, 2019).
- Lack of required disclosures or legally mandated information as per Indian regulations.
- Potential conflicts with privacy laws (e.g., Digital Personal Data Protection Act).
- Any other terms that seem non-compliant with standard legal practices in India.

For each compliance issue you identify, provide the specific Indian law being violated, the exact clause from the document, a clear explanation of the issue, and a recommendation for the user.

Legal Document:
"""
{{{documentText}}}
"""

If there are no significant compliance issues, return an empty array for the 'complianceIssues' field.
`,
});

const checkComplianceFlow = ai.defineFlow(
  {
    name: 'checkComplianceFlow',
    inputSchema: CheckComplianceInputSchema,
    outputSchema: CheckComplianceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
