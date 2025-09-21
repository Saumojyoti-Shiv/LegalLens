"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, ShieldAlert, AlertTriangle, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type Risk = {
    clause: string;
    risk: string;
    severity: 'High' | 'Medium' | 'Low';
}

type ComplianceIssue = {
    law: string;
    clause: string;
    issue: string;
    recommendation: string;
};

interface AnalysisPanelProps {
  summary: string | null;
  risks: Risk[] | null;
  complianceIssues: ComplianceIssue[] | null;
  isLoadingSummary: boolean;
  isLoadingRisks: boolean;
  isLoadingCompliance: boolean;
  isAnalyzed: boolean;
}

export function AnalysisPanel({
  summary,
  risks,
  complianceIssues,
  isLoadingSummary,
  isLoadingRisks,
  isLoadingCompliance,
  isAnalyzed,
}: AnalysisPanelProps) {
    
  const [riskFilter, setRiskFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const getSeverityBadge = (severity: Risk['severity']) => {
    switch (severity) {
      case 'High':
        return <Badge variant="destructive">High</Badge>;
      case 'Medium':
        return <Badge variant="secondary" className="bg-amber-500 text-white">Medium</Badge>;
      case 'Low':
        return <Badge variant="secondary" className="bg-green-500 text-white">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const filteredRisks = risks?.filter(risk => riskFilter === 'All' || risk.severity === riskFilter);

  return (
    <Card className="bg-card/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-foreground">
          <Bot className="text-primary" />
          <span>AI Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {!isAnalyzed && !isLoadingSummary ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 min-h-[300px]">
            <p className="font-semibold">Analysis Appears Here</p>
            <p className="text-sm">Upload a document and click "Analyze Document" to begin.</p>
          </div>
        ) : (
          <Tabs defaultValue="summary" className="flex flex-col h-full min-h-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="flex-1 mt-4 overflow-y-auto">
              {isLoadingSummary && <div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></div>}
              {summary && <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{summary}</p>}
            </TabsContent>

            <TabsContent value="risks" className="flex-1 mt-4 flex flex-col overflow-y-auto">
                {isLoadingRisks && <div className="space-y-4"><div className="space-y-2"><Skeleton className="h-6 w-1/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></div><div className="space-y-2"><Skeleton className="h-6 w-1/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></div></div>}
                {risks && risks.length > 0 && (
                    <>
                        <div className="flex items-center gap-2 mb-4">
                            <Button variant={riskFilter === 'All' ? 'secondary' : 'outline'} size="sm" onClick={() => setRiskFilter('All')}>All</Button>
                            <Button variant={riskFilter === 'High' ? 'secondary' : 'outline'} size="sm" onClick={() => setRiskFilter('High')}>High</Button>
                            <Button variant={riskFilter === 'Medium' ? 'secondary' : 'outline'} size="sm" onClick={() => setRiskFilter('Medium')}>Medium</Button>
                            <Button variant={riskFilter === 'Low' ? 'secondary' : 'outline'} size="sm" onClick={() => setRiskFilter('Low')}>Low</Button>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                            {filteredRisks?.map((risk, index) => (
                                 <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-4 justify-between w-full pr-4">
                                            <p className="text-left text-sm flex-1 whitespace-normal">
                                                <AlertTriangle className={cn("inline-block mr-2 h-4 w-4",
                                                    risk.severity === 'High' && "text-red-500",
                                                    risk.severity === 'Medium' && "text-amber-500",
                                                    risk.severity === 'Low' && "text-green-500"
                                                )}/>
                                                {risk.clause}
                                            </p>
                                            {getSeverityBadge(risk.severity)}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4">
                                        <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{risk.risk}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                         {filteredRisks?.length === 0 && !isLoadingRisks && (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                                <p>No risks found for this category.</p>
                            </div>
                        )}
                    </>
                )}
                 {risks && risks.length === 0 && !isLoadingRisks && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                        <ShieldAlert className="h-8 w-8 mb-4 text-green-500" />
                        <p className="font-semibold">No Major Risks Detected</p>
                        <p className="text-sm">Our AI analysis did not find any significant red flags in your document.</p>
                    </div>
                )}
            </TabsContent>

            <TabsContent value="compliance" className="flex-1 mt-4 flex flex-col overflow-y-auto">
                {isLoadingCompliance && <div className="space-y-4"><div className="space-y-2"><Skeleton className="h-6 w-1/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></div><div className="space-y-2"><Skeleton className="h-6 w-1/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></div></div>}
                {complianceIssues && complianceIssues.length > 0 && (
                     <Accordion type="single" collapsible className="w-full">
                        {complianceIssues.map((item, index) => (
                             <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>
                                    <div className="flex items-center gap-4 justify-between w-full pr-4">
                                        <p className="text-left text-sm font-semibold flex-1 whitespace-normal">
                                            <Landmark className="inline-block mr-2 h-4 w-4 text-primary"/>
                                            {item.law}
                                        </p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 space-y-4">
                                     <div>
                                        <h4 className="font-semibold mb-1">Clause:</h4>
                                        <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground text-sm">{item.clause}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">Issue:</h4>
                                        <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{item.issue}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">Recommendation:</h4>
                                        <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{item.recommendation}</p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
                 {complianceIssues && complianceIssues.length === 0 && !isLoadingCompliance && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                        <ShieldAlert className="h-8 w-8 mb-4 text-green-500" />
                        <p className="font-semibold">No Compliance Issues Detected</p>
                        <p className="text-sm">Our AI analysis did not find any compliance issues based on Indian Law.</p>
                    </div>
                )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
