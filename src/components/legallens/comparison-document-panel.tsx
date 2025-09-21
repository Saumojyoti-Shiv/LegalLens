"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, UploadCloud, File as FileIcon, X } from "lucide-react";
import { pdfjs } from 'react-pdf';
import mammoth from "mammoth";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";


// Setting workerSrc for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface ComparisonDocumentPanelProps {
  title: string;
  onTextExtracted: (text: string) => void;
  isCompared: boolean;
}

export function ComparisonDocumentPanel({ title, onTextExtracted, isCompared }: ComparisonDocumentPanelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (isCompared) {
      setShowPreview(false);
    } else {
      setShowPreview(true);
    }
  }, [isCompared]);

  const resetState = () => {
    setFile(null);
    setFileContent("");
    onTextExtracted("");
    setShowPreview(true);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      // Reset local state for new file upload
      setFile(uploadedFile);
      setFileContent("");
      setIsReadingFile(true);
      setReadProgress(0);
      setShowPreview(true);

      try {
        let text = "";
        if (uploadedFile.type === "application/pdf") {
          const arrayBuffer = await uploadedFile.arrayBuffer();
          const pdf = await pdfjs.getDocument(arrayBuffer).promise;
          const numPages = pdf.numPages;
          let extractedText = "";
          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            extractedText += textContent.items.map(item => ('str' in item ? item.str : '')).join(" ");
            setReadProgress((i / numPages) * 100);
          }
          text = extractedText;
        } else if (
          uploadedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const arrayBuffer = await uploadedFile.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          text = result.value;
          setReadProgress(100);
        } else if (uploadedFile.type === "text/plain") {
          text = await uploadedFile.text();
          setReadProgress(100);
        } else {
            console.error("Unsupported file type");
            setFile(null);
            return;
        }
        setFileContent(text);
        onTextExtracted(text);
      } catch (error) {
        console.error("Error reading file:", error);
        setFile(null);
      } finally {
        setIsReadingFile(false);
      }
    }
  }, [onTextExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  return (
    <Card className="bg-card/50 shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-foreground">
          <div className="flex items-center gap-3">
             <FileText className="text-primary" />
             <span>{title}</span>
          </div>
          {fileContent && (
             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={resetState}>
                <X className="h-4 w-4" />
             </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-4">
        {fileContent ? (
          showPreview ? (
            <ScrollArea className="rounded-lg border p-4 h-full bg-background flex-1 min-h-[300px]">
                <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed text-sm">{fileContent}</p>
            </ScrollArea>
          ) : (
            <div
              className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors h-full min-h-[300px] border-border hover:border-primary/50"
              onClick={() => setShowPreview(true)}
            >
               <div className="text-center">
                    <FileIcon className="mx-auto h-12 w-12 text-foreground" />
                    <p className="mt-2 font-semibold">{file?.name}</p>
                    <p className="text-sm text-muted-foreground">Click to preview</p>
                </div>
            </div>
          )
        ) : (
            <div
                {...getRootProps()}
                className={cn(`flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors h-full min-h-[300px]`,
                isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50")}
            >
                <input {...getInputProps()} />
                {isReadingFile ? (
                    <div className="flex flex-col items-center justify-center text-center w-full">
                        <p className="font-semibold mb-2">Reading file...</p>
                        <Progress value={readProgress} className="w-3/4" />
                    </div>
                ) : (
                <div className="text-center text-muted-foreground">
                    <UploadCloud className="mx-auto h-12 w-12" />
                    <p className="mt-4 font-semibold">Drag & drop a file here, or click to select</p>
                    <p className="text-sm">Supported formats: .pdf, .docx, .txt</p>
                </div>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
