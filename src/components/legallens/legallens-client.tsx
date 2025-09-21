"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { handleSummarize, handleExplainClause, handleQuestion, handleDetectRisks, handleCheckCompliance } from "@/app/actions";
import { Header } from "./header";
import { DocumentPanel } from "./document-panel";
import { AnalysisPanel } from "./analysis-panel";
import { QAPanel } from "./qa-panel";
import { Sidebar, SidebarProvider, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuAction } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { ComparisonClient } from "./comparison-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";


type QA = {
  question: string;
  answer: string;
};

type Risk = {
    clause: string;
    risk: string;
    severity: 'High' | 'Medium' | 'Low';
};

type ComplianceIssue = {
    law: string;
    clause: string;
    issue: string;
    recommendation: string;
};

type AnalysisHistoryItem = {
  id: string;
  title: string;
  documentText: string;
  summary: string;
  risks: Risk[];
  complianceIssues: ComplianceIssue[];
  qaHistory: QA[];
  timestamp: string;
};

type AppMode = "analyze" | "compare";

export function LegalLensClient() {
  const [mode, setMode] = useState<AppMode>("analyze");
  const [documentText, setDocumentText] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [qaHistory, setQaHistory] = useState<QA[]>([]);
  const [risks, setRisks] = useState<Risk[] | null>(null);
  const [complianceIssues, setComplianceIssues] = useState<ComplianceIssue[] | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistoryItem[]>([]);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);
  const [isExplanationDialogOpen, setIsExplanationDialogOpen] = useState(false);

  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isLoadingRisks, setIsLoadingRisks] = useState(false);
  const [isLoadingCompliance, setIsLoadingCompliance] = useState(false);

  const { toast } = useToast();

  const onAnalyze = async (text: string) => {
    if (!text.trim()) {
      toast({ title: "Error", description: "Document text cannot be empty.", variant: "destructive" });
      return;
    }

    // Reset UI for new analysis
    setIsLoadingSummary(true);
    setIsLoadingRisks(true);
    setIsLoadingCompliance(true);
    setSummary(null);
    setExplanation(null);
    setQaHistory([]);
    setRisks(null);
    setComplianceIssues(null);
    setDocumentText(text);
    setActiveAnalysisId(null); // Set to null while new one is created

    // Run analyses in parallel
    const [summaryResult, risksResult, complianceResult] = await Promise.all([
      handleSummarize({ documentText: text }),
      handleDetectRisks({ documentText: text }),
      handleCheckCompliance({ documentText: text })
    ]);

    setIsLoadingSummary(false);
    setIsLoadingRisks(false);
    setIsLoadingCompliance(false);
    
    if (summaryResult.success && risksResult.success && complianceResult.success) {
      const newSummary = summaryResult.data.summary;
      const newRisks = risksResult.data.risks;
      const newComplianceIssues = complianceResult.data.complianceIssues;
      setSummary(newSummary);
      setRisks(newRisks);
      setComplianceIssues(newComplianceIssues);

      const newHistoryItem: AnalysisHistoryItem = {
        id: new Date().toISOString(),
        title: newSummary.split(" ").slice(0, 5).join(" ") + "...",
        documentText: text,
        summary: newSummary,
        risks: newRisks,
        complianceIssues: newComplianceIssues,
        qaHistory: [],
        timestamp: new Date().toLocaleString(),
      };

      setAnalysisHistory(prev => [newHistoryItem, ...prev]);
      setActiveAnalysisId(newHistoryItem.id);

    } else {
       if (!summaryResult.success) {
        toast({ title: "Error Summarizing", description: summaryResult.error, variant: "destructive" });
      }
      if (!risksResult.success) {
        toast({ title: "Error Detecting Risks", description: risksResult.error, variant: "destructive" });
      }
      if (!complianceResult.success) {
        toast({ title: "Error Checking Compliance", description: complianceResult.error, variant: "destructive" });
      }
      setDocumentText(""); // Clear document on error
    }
  };

  const onExplainClause = async (clause: string) => {
    if (!clause.trim() || !activeAnalysisId) return;
    setIsLoadingExplanation(true);
    setExplanation(null);
    setIsExplanationDialogOpen(true);
    
    const result = await handleExplainClause({ documentText, clause });
    if (result.success) {
      const newExplanation = result.data.explanation;
      setExplanation(newExplanation);
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
      setIsExplanationDialogOpen(false); // Close dialog on error
    }
    setIsLoadingExplanation(false);
  };

  const onAskQuestion = async (question: string) => {
    if (!question.trim() || !documentText.trim() || !activeAnalysisId) return;

    setIsLoadingQuestion(true);
    
    const result = await handleQuestion({ documentText, question });
    if (result.success) {
      const newQaItem = { question, answer: result.data.answer };
      const newQaHistory = [...qaHistory, newQaItem];
      setQaHistory(newQaHistory);
      // Update history item with new Q&A
      setAnalysisHistory(prev => prev.map(item => item.id === activeAnalysisId ? {...item, qaHistory: newQaHistory} : item));
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setIsLoadingQuestion(false);
  };
  
  const resetApp = () => {
    setDocumentText("");
    setSummary(null);
    setExplanation(null);
    setQaHistory([]);
    setRisks(null);
    setComplianceIssues(null);
    setActiveAnalysisId(null);
  };

  const handleNewAnalysis = () => {
    resetApp();
    setMode('analyze');
  }

  const loadHistoryItem = (id: string) => {
    const item = analysisHistory.find(item => item.id === id);
    if (item) {
      setDocumentText(item.documentText);
      setSummary(item.summary);
      setExplanation(null); // Explanations are not stored in history
      setQaHistory(item.qaHistory);
      setRisks(item.risks);
      setComplianceIssues(item.complianceIssues);
      setActiveAnalysisId(item.id);
      setMode('analyze');
    }
  };

  const deleteHistoryItem = (idToDelete: string) => {
    setAnalysisHistory(prev => prev.filter(item => item.id !== idToDelete));
    if (activeAnalysisId === idToDelete) {
      resetApp();
    }
  };

  const isAnalyzed = documentText.length > 0 && activeAnalysisId !== null;
  
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen bg-background font-body">
        <Header mode={mode} onModeChange={setMode} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar>
            <SidebarContent>
              <SidebarHeader>
                 <Button variant="outline" className="w-full" onClick={handleNewAnalysis}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Analysis
                </Button>
              </SidebarHeader>
              <SidebarMenu className="mt-4">
                 {analysisHistory.length === 0 ? (
                    <div className="px-2 text-sm text-muted-foreground">
                        Your previous analyses will appear here.
                    </div>
                 ) : (
                    analysisHistory.map(item => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={item.id === activeAnalysisId}
                          onClick={() => loadHistoryItem(item.id)}
                          className="h-auto flex-col items-start"
                        >
                          <span className="font-semibold text-sm">{item.title}</span>
                          <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                        </SidebarMenuButton>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <SidebarMenuAction showOnHover>
                              <Trash2 />
                            </SidebarMenuAction>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this analysis history.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteHistoryItem(item.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </SidebarMenuItem>
                    ))
                 )}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              <div className="lg:col-span-2 flex flex-col gap-6">
                {mode === 'analyze' && (
                  <>
                    <DocumentPanel
                        documentText={documentText}
                        isAnalyzed={isAnalyzed}
                        isLoading={isLoadingSummary || isLoadingRisks || isLoadingCompliance}
                        onAnalyze={onAnalyze}
                        onExplainClause={onExplainClause}
                        onReset={resetApp}
                    />
                    {isAnalyzed && (
                      <AnalysisPanel
                          summary={summary}
                          risks={risks}
                          complianceIssues={complianceIssues}
                          isLoadingSummary={isLoadingSummary}
                          isLoadingRisks={isLoadingRisks}
                          isLoadingCompliance={isLoadingCompliance}
                          isAnalyzed={isAnalyzed}
                      />
                    )}
                  </>
                )}
                {mode === 'compare' && (
                  <ComparisonClient />
                )}
              </div>
              <div className="lg:col-span-1 h-full flex flex-col">
                  <QAPanel
                      qaHistory={qaHistory}
                      isLoadingQuestion={isLoadingQuestion}
                      isAnalyzed={isAnalyzed}
                      onAskQuestion={onAskQuestion}
                  />
              </div>
            </div>
          </main>
        </div>
        <Dialog open={isExplanationDialogOpen} onOpenChange={setIsExplanationDialogOpen}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Clause Explanation</DialogTitle>
              <DialogDescription>
                AI-powered explanation of the selected document clause.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {isLoadingExplanation ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed text-sm text-foreground/90">
                  {explanation}
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
}
