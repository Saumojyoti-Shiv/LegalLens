"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ChevronRight, UploadCloud, File as FileIcon, X } from "lucide-react";
import mammoth from "mammoth";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface DocumentPanelProps {
  documentText: string;
  isAnalyzed: boolean;
  isLoading: boolean;
  onAnalyze: (text: string) => void;
  onExplainClause: (clause: string) => void;
  onReset: () => void;
}

export function DocumentPanel({ documentText, isAnalyzed, isLoading, onAnalyze, onExplainClause, onReset }: DocumentPanelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    onReset();
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setIsReadingFile(true);
      try {
        let text = "";
        if (uploadedFile.type === "application/pdf") {
          // Dynamic import to avoid build-time canvas dependency
          const { pdfjs } = await import('react-pdf');
          pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
          
          const arrayBuffer = await uploadedFile.arrayBuffer();
          const pdf = await pdfjs.getDocument(arrayBuffer).promise;
          const numPages = pdf.numPages;
          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            text += textContent.items.map(item => ('str' in item ? item.str : '')).join(" ");
          }
        } else if (
          uploadedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const arrayBuffer = await uploadedFile.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          text = result.value;
        } else if (uploadedFile.type === "text/plain") {
          text = await uploadedFile.text();
        } else {
            console.error("Unsupported file type");
            setFile(null);
            setIsReadingFile(false);
            return;
        }
        setFileContent(text);
      } catch (error) {
        console.error("Error reading file:", error);
        setFile(null);
      } finally {
        setIsReadingFile(false);
      }
    }
  }, [onReset]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  const handleAnalyzeClick = () => {
    if(fileContent) {
        onAnalyze(fileContent);
    }
  };
  
  const handleTextSelection = () => {
    const text = window.getSelection()?.toString() || "";
    if (text.trim().length > 10) {
      setSelectedText(text);
      setPopoverOpen(true);
    } else {
      setPopoverOpen(false);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      const text = window.getSelection()?.toString() || "";
       if (text.trim().length <= 10) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleExplain = () => {
    setPopoverOpen(false);
    onExplainClause(selectedText);
  };
  
  return (
    <Card className="bg-card/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-foreground">
          <FileText className="text-primary" />
          <span>Legal Document</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!isAnalyzed && (
            <div className="flex flex-col gap-4">
            <div
                {...getRootProps()}
                className={`flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors min-h-[200px]
                ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
            >
                <input {...getInputProps()} />
                {file ? (
                <div className="text-center">
                    <FileIcon className="mx-auto h-12 w-12 text-foreground" />
                    <p className="mt-2 font-semibold">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{Math.round(file.size / 1024)} KB</p>
                </div>
                ) : (
                <div className="text-center text-muted-foreground">
                    <UploadCloud className="mx-auto h-12 w-12" />
                    <p className="mt-4 font-semibold">Drag & drop a file here, or click to select</p>
                    <p className="text-sm">Supported formats: .pdf, .docx, .txt</p>
                </div>
                )}
            </div>
            
            <Button onClick={handleAnalyzeClick} disabled={isReadingFile || isLoading || !fileContent.trim()}>
                {isReadingFile ? "Reading File..." : isLoading ? "Analyzing..." : "Analyze Document"}
                {!isReadingFile && !isLoading && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
            </div>
        )}
        {isAnalyzed && (
           <div className="flex flex-col gap-4">
            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>View Uploaded Document</AccordionTrigger>
                <AccordionContent>
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <ScrollArea className="rounded-lg border p-4 h-96 bg-background" onMouseUp={handleTextSelection}>
                        <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">{documentText}</p>
                      </ScrollArea>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-1 z-50">
                      <Button variant="ghost" size="sm" onClick={handleExplain}>Explain Selection</Button>
                    </PopoverContent>
                  </Popover>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
