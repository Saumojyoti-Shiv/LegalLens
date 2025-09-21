"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Bot, Scale, CheckCircle, AlertCircle } from "lucide-react";

export type ComparisonPoint = {
    topic: string;
    summaryA: string;
    summaryB: string;
    verdict: string;
};

interface ComparisonResultPanelProps {
    result: ComparisonPoint[] | null;
}

export function ComparisonResultPanel({ result }: ComparisonResultPanelProps) {
    if (!result) return null;

    if (result.length === 0) {
        return (
            <Card className="bg-card/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-foreground">
                        <Bot className="text-primary" />
                        <span>Comparison Result</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 min-h-[200px]">
                        <CheckCircle className="h-8 w-8 mb-4 text-green-500" />
                        <p className="font-semibold">No Significant Differences Found</p>
                        <p className="text-sm">Our AI analysis indicates that both documents are substantially similar in their key terms.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card className="bg-card/50 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                    <Bot className="text-primary" />
                    <span>Comparison Result</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                    {result.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-4 justify-between w-full pr-4">
                                    <p className="text-left font-semibold flex-1 whitespace-normal text-base">
                                        <Scale className="inline-block mr-3 h-5 w-5 text-primary"/>
                                        {item.topic}
                                    </p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold mb-2 border-b pb-1">Document A</h4>
                                        <p className="whitespace-pre-wrap leading-relaxed text-sm text-foreground/90">{item.summaryA}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2 border-b pb-1">Document B</h4>
                                        <p className="whitespace-pre-wrap leading-relaxed text-sm text-foreground/90">{item.summaryB}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2"><AlertCircle className="h-5 w-5 text-amber-500"/>Verdict</h4>
                                    <p className="whitespace-pre-wrap leading-relaxed text-sm text-foreground/90 bg-background/50 p-3 rounded-md">{item.verdict}</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}
