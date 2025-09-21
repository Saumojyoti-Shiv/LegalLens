"use server";

import {
  summarizeLegalDocument,
  SummarizeLegalDocumentInput,
} from "@/ai/flows/summarize-legal-document";
import {
  explainSelectedClause,
  ExplainSelectedClauseInput,
} from "@/ai/flows/explain-selected-clause";
import {
  answerQuestionsAboutDocument,
  AnswerQuestionsAboutDocumentInput,
} from "@/ai/flows/answer-questions-about-document";
import { 
  detectRisks,
  DetectRisksInput 
} from "@/ai/flows/detect-risks";
import {
  checkCompliance,
  CheckComplianceInput
} from "@/ai/flows/check-compliance";
import {
  compareDocuments,
  CompareDocumentsInput,
} from "@/ai/flows/compare-documents";

export async function handleSummarize(
  input: SummarizeLegalDocumentInput
) {
  try {
    const result = await summarizeLegalDocument(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to summarize document." };
  }
}

export async function handleExplainClause(
  input: ExplainSelectedClauseInput
) {
  try {
    const result = await explainSelectedClause(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to explain clause." };
  }
}

export async function handleQuestion(
  input: AnswerQuestionsAboutDocumentInput
) {
  try {
    const result = await answerQuestionsAboutDocument(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to answer question." };
  }
}

export async function handleDetectRisks(
  input: DetectRisksInput
) {
  try {
    const result = await detectRisks(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to detect risks." };
  }
}

export async function handleCheckCompliance(
  input: CheckComplianceInput
) {
  try {
    const result = await checkCompliance(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to check compliance." };
  }
}

export async function handleCompare(
  input: CompareDocumentsInput
) {
  try {
    const result = await compareDocuments(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to compare documents." };
  }
}
