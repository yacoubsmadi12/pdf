import React, { useState } from 'react';
import { ToolLayout } from '@/components/layout/ToolLayout';
import { FileDropZone } from '@/components/shared/FileDropZone';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { DownloadResult } from '@/components/shared/DownloadResult';
import { Button } from '@/components/ui/button';
import { FileImage, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function JpgToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{url: string, filename: string} | null>(null);
  const { toast } = useToast();

  const handleProcess = async () => {
    if (files.length === 0) {
      toast({ title: "Select at least 1 image", variant: "destructive" });
      return;
    }
    
    setIsProcessing(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      
      const response = await fetch('/api/img/to-pdf', { method: 'POST', body: formData });
      if (!response.ok) throw new Error("Failed to convert images to PDF");
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResult({ url, filename: 'converted_images.pdf' });
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  if (result) {
    return (
      <ToolLayout title="JPG to PDF" description="Convert JPG images to PDF in seconds. Easily adjust orientation and margins.">
        <DownloadResult url={result.url} filename={result.filename} onReset={() => {setResult(null); setFiles([]);}} />
      </ToolLayout>
    );
  }

  return (
    <ToolLayout title="JPG to PDF" description="Convert JPG images to PDF in seconds. Easily adjust orientation and margins.">
      {files.length === 0 ? (
        <FileDropZone multiple accept="image/jpeg,image/png" onFilesSelected={setFiles} />
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file, i) => (
              <div key={i} className="relative group bg-card border rounded-lg p-4 flex flex-col items-center justify-center text-center gap-2">
                <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeFile(i)}>
                  <X className="w-3 h-3" />
                </Button>
                <FileImage className="w-10 h-10 text-primary opacity-80" />
                <span className="text-xs truncate w-full" title={file.name}>{file.name}</span>
              </div>
            ))}
            <div className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center bg-muted/20 hover:bg-muted/50 transition-colors">
              <label className="cursor-pointer text-sm font-medium text-muted-foreground flex flex-col items-center">
                <span className="text-2xl mb-1">+</span> Add more
                <input type="file" accept="image/jpeg,image/png" multiple className="hidden" onChange={(e) => {
                  if (e.target.files) setFiles([...files, ...Array.from(e.target.files)]);
                }} />
              </label>
            </div>
          </div>
          
          {isProcessing ? (
            <div className="p-8 bg-card border rounded-xl shadow-sm">
              <ProgressBar progress={50} label="Converting to PDF..." />
            </div>
          ) : (
            <div className="flex justify-center">
              <Button size="lg" className="w-full md:w-auto px-12 text-lg h-14" onClick={handleProcess}>
                Convert to PDF
              </Button>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
