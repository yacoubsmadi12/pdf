import React, { useState } from 'react';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { FileDropZone } from '@/components/shared/FileDropZone';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { DownloadResult } from '@/components/shared/DownloadResult';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function GenericToolPage({
  title,
  description,
  endpoint,
  accept = "application/pdf",
  fileKey = "file",
  extraFields,
  outputExtension = "pdf"
}: {
  title: string;
  description: string;
  endpoint: string;
  accept?: string;
  fileKey?: string;
  extraFields?: React.ReactNode;
  outputExtension?: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{url: string, filename: string} | null>(null);
  const { toast } = useToast();

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setIsProcessing(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      formData.append(fileKey, file);
      
      const response = await fetch(endpoint, { method: 'POST', body: formData });
      if (!response.ok) throw new Error(`Failed to process document`);
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResult({ url, filename: `processed_${file.name.split('.')[0]}.${outputExtension}` });
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  if (result) {
    return (
      <ToolLayout title={title} description={description}>
        <DownloadResult url={result.url} filename={result.filename} onReset={() => {setResult(null); setFile(null);}} />
      </ToolLayout>
    );
  }

  return (
    <ToolLayout title={title} description={description}>
      {!file ? (
        <FileDropZone accept={accept} onFilesSelected={(files) => setFile(files[0])} />
      ) : (
        <div className="w-full max-w-xl mx-auto space-y-6">
          <div className="p-4 bg-muted/20 border rounded-lg text-center font-medium">
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
          
          {isProcessing ? (
            <div className="p-8 bg-card border rounded-xl shadow-sm">
              <ProgressBar progress={60} label="Processing..." />
            </div>
          ) : (
            <form onSubmit={handleProcess} className="space-y-6 bg-card border p-6 rounded-xl shadow-sm">
              {extraFields}
              <Button type="submit" size="lg" className="w-full h-12 text-lg">
                Process Document
              </Button>
            </form>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
