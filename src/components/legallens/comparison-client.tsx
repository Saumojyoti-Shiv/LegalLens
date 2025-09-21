"use client";

import { useState } from "react";
import { ComparisonDocumentPanel } from "./comparison-document-panel";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { handleCompare } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { ComparisonResultPanel, type ComparisonPoint } from "./comparison-result-panel";

export function ComparisonClient() {
  const [doc1Text, setDoc1Text] = useState("");
  const [doc2Text, setDoc2Text] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonPoint[] | null>(null);
  const { toast } = useToast();

  const handleDoc1Extract = (text: string) => {
    setDoc1Text(text);
    setComparisonResult(null); // Reset on new file
  };

  const handleDoc2Extract = (text: string) => {
    setDoc2Text(text);
    setComparisonResult(null); // Reset on new file
  };
  
  const handleCompareClick = async () => {
    if (!doc1Text || !doc2Text) {
       toast({
        title: "Missing Documents",
        description: "Please upload both documents before comparing.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setComparisonResult(null);

    const result = await handleCompare({ documentTextA: doc1Text, documentTextB: doc2Text });

    setIsLoading(false);

    if (result.success) {
      setComparisonResult(result.data.comparison);
    } else {
      toast({
        title: "Error Comparing Documents",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const isCompared = comparisonResult !== null;

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComparisonDocumentPanel
          title="Document A"
          onTextExtracted={handleDoc1Extract}
          isCompared={isCompared}
        />
        <ComparisonDocumentPanel
          title="Document B"
          onTextExtracted={handleDoc2Extract}
          isCompared={isCompared}
        />
      </div>
      
      {!isCompared && (
        <div className="flex justify-center pb-4">
            <Button onClick={handleCompareClick} disabled={!doc1Text || !doc2Text || isLoading}>
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Comparing...
                </>
            ) : (
                <>
                    Compare Documents
                    <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
            </Button>
        </div>
      )}

      {isCompared && (
        <ComparisonResultPanel result={comparisonResult} />
      )}
    </div>
  );
}
