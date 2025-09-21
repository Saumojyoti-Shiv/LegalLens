"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { HelpCircle, User, Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type QA = {
  question: string;
  answer: string;
};

interface QAPanelProps {
  qaHistory: QA[];
  isLoadingQuestion: boolean;
  isAnalyzed: boolean;
  onAskQuestion: (question: string) => void;
}

export function QAPanel({
  qaHistory,
  isLoadingQuestion,
  isAnalyzed,
  onAskQuestion,
}: QAPanelProps) {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [qaHistory, isLoadingQuestion]);

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion.trim() || !isAnalyzed) return;
    onAskQuestion(currentQuestion);
    setCurrentQuestion("");
  };

  return (
    <Card className="bg-card/50 shadow-lg h-full flex flex-col max-h-[85vh]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-foreground">
          <HelpCircle className="text-primary" />
          <span>Ask a Question</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {qaHistory.map((item, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 border">
                        <AvatarFallback>
                            <User className="w-4 h-4" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="bg-background/50 rounded-lg p-3">
                        <p className="font-semibold text-sm text-primary mb-1">You</p>
                        <p className="text-sm break-words">{item.question}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 border">
                        <AvatarFallback>
                            <Bot className="w-4 h-4" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="bg-background/50 rounded-lg p-3">
                        <p className="font-semibold text-sm text-foreground mb-1">LegalLens AI</p>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90 break-words">{item.answer}</p>
                    </div>
                </div>
              </div>
            ))}
            {isLoadingQuestion && (
                <div className="flex items-start gap-3">
                     <Avatar className="w-8 h-8 border">
                        <AvatarFallback>
                            <Bot className="w-4 h-4" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="bg-background/50 rounded-lg p-3 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            )}
            {qaHistory.length === 0 && !isLoadingQuestion && (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                    <p>
                    {isAnalyzed 
                        ? "Ask a specific question about the document using the input below."
                        : "Analyze a document to start asking questions."
                    }
                    </p>
                </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleQuestionSubmit} className="flex gap-2 pt-4 border-t border-border">
          <Input
            placeholder="Ask a question..."
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            disabled={isLoadingQuestion || !isAnalyzed}
            className="bg-background"
          />
          <Button type="submit" disabled={isLoadingQuestion || !currentQuestion.trim() || !isAnalyzed}>Ask</Button>
        </form>
      </CardContent>
    </Card>
  );
}
